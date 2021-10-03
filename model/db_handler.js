const Utility = require("../config/utilis/utilities");
const Meeting = require("./do/meeting");
const Server = require("./do/server");
const CronJob = require("../lib/cron_helper/cron_handler");

const database = Utility.getDbStorageHandler();

var cacheNewUserMeetingData = new Map()

module.exports.onNewInstanceCreated = async function (body) {
    var server = new Server()
    server.ip = body.ip
    server.maxNoOfUsers = body.maxUsers
    database.updateStandBySystem(server)
}


module.exports.onNewMeeting = async function (body) {
    console.log("onNewMeeting");

    var meeting = new Meeting()
    const ip = body.ip
    meeting.serverIp = body.ip
    meeting.noOfEstimatedUsers = body.estimatedUsers
    meeting.id = body.meeting_id
    var noOfAlreadyJoinedUsers = 0;
    if (cacheNewUserMeetingData.has(ip)) {
        noOfAlreadyJoinedUsers = cacheNewUserMeetingData.get(ip)
        cacheNewUserMeetingData.delete(ip)
    }
    meeting.noOfActualUsers = noOfAlreadyJoinedUsers;
    var server = await database.getStandByServerByIp(meeting.serverIp)
    console.log("standByServer", server);
    if (!server || server === null) {
        server = await database.getUsedServerByIP(meeting.serverIp)
    }
    else {
        await database.deleteStandBySystem(meeting.serverIp)
    }

    if (server && server !== null) {
        for (let oldMeeting of server.meetings) {
            if (oldMeeting.id === meeting.id) {
                return;
            }
        }
        server.meetings.push(meeting)
        server.noOfEstimatedUsers = server.noOfEstimatedUsers + meeting.noOfEstimatedUsers
        server.noOfActualUsers = server.noOfActualUsers + meeting.noOfActualUsers
        await database.updateInUsedSystems(server)
    }

    await database.updateMeetingByMeetingId(meeting)

    CronJob.auditSystems()
}


module.exports.onNewUserJoined = async function (body) {
    console.log("onNewUserJoined");

    let meetingId = body.meeting_id
    let ip = body.ip
    var server = await database.getUsedServerByIP(ip)
    var isMeetingPresent = false;

    if (!server || server === null) {
        isMeetingPresent = false;
    }
    else {
        for (let oldMeeting of server.meetings) {
            if (oldMeeting.id === meetingId) {
                isMeetingPresent = true;
                break;
            }
        }
    }
    if (isMeetingPresent === false) {
        var noOfUserInWaitingRoom = 0;
        if (cacheNewUserMeetingData.has(ip)) {
            noOfUserInWaitingRoom = cacheNewUserMeetingData.get(ip)
        }
        noOfUserInWaitingRoom = noOfUserInWaitingRoom + 1;

        cacheNewUserMeetingData.set(ip, noOfUserInWaitingRoom)
        return;
    }

    server.noOfActualUsers = server.noOfActualUsers + 1;
    let meeting = null
    for (let oldMeeting of server.meetings) {
        if (oldMeeting.id === meetingId) {
            oldMeeting.noOfActualUsers = oldMeeting.noOfActualUsers + 1;
            meeting = oldMeeting;
            break;
        }
    }

    await database.updateInUsedSystems(server)
    if (meeting !== null) {
        await database.updateMeetingByMeetingId(meeting)
    }

}

module.exports.onUserLeft = async function (body) {
    console.log("onUserLeft");
    let meetingId = body.meeting_id
    let ip = body.ip
    var server = await database.getUsedServerByIP(ip)
    var isMeetingPresent = false;

    if (!server || server === null) {
        isMeetingPresent = false;
    }
    else {
        for (let oldMeeting of server.meetings) {
            if (oldMeeting.id === meetingId) {
                isMeetingPresent = true;
                break;
            }
        }
    }
    if (isMeetingPresent === false) {
        var noOfUserInWaitingRoom = 1;
        if (cacheNewUserMeetingData.has(ip)) {
            noOfUserInWaitingRoom = cacheNewUserMeetingData.get(ip)
            noOfUserInWaitingRoom = noOfUserInWaitingRoom - 1;
            cacheNewUserMeetingData.set(ip, noOfUserInWaitingRoom)
        }
        return;
    }

    server.noOfActualUsers = server.noOfActualUsers - 1;
    let meeting = null
    for (let oldMeeting of server.meetings) {
        if (oldMeeting.id === meetingId) {
            oldMeeting.noOfActualUsers = oldMeeting.noOfActualUsers - 1;
            meeting = oldMeeting;
            break;
        }
    }

    await database.updateInUsedSystems(server)

    if (meeting !== null) {
        await database.updateMeetingByMeetingId(meeting)
    }


}



module.exports.onMeetingEnded = async function (body) {
    console.log("onMeetingEnded");
    let meetingId = body.meeting_id
    let ip = body.ip
    var server = await database.getUsedServerByIP(ip)
    if (!server || server === null) {
        return;
    }
    else {
        var indexToRemove = -1;
        for (let i = 0; i < server.meetings.length; i++) {
            if (server.meetings[i].id === meetingId) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove > -1) {
            server.meetings.splice(indexToRemove, 1)
        }

        if (server.meetings.length > 0) {

            await database.updateInUsedSystems(server)
        }
        else {
            server.noOfEstimatedUsers = 0;
            server.noOfActualUsers = 0;
            await database.updateStandBySystem(server)
            await database.deleteInUseServer(ip)
        }
    }

    database.deleteMeeting(meetingId)

}


module.exports.getIpForMeeting = async function (body) {
    let meetingId = body.meeting_id

    //Check if meeting id already exist

    let meeting = await database.getMeetingById(meetingId);
    if (meeting && meeting !== null) {
        return meeting.serverIp;
    }

    let noOfEstimatedUsers = body.estimated_users
    const servers = await database.getAllInUseServer()

    var leastNoOfParticipantServer = null;
    var perctangeOfFreeServer = 0;

    for (const [systemIp, server] of Object.entries(servers)) {
        const maxNumberOfUserPresentRightNow = Math.max(server.noOfEstimatedUsers, server.noOfActualUsers)
        const noOfUserCanHandle = server.maxNoOfUsers;
        const perctange = maxNumberOfUserPresentRightNow / noOfUserCanHandle;
        if (perctangeOfFreeServer < perctange) {
            perctangeOfFreeServer = perctange;
            leastNoOfParticipantServer = server;
        }
    }


    var canUseExitingSystem = false;
    if (leastNoOfParticipantServer !== null) {
        let totalNumberOfUserAfterCurrentMeeting = (Math.max(leastNoOfParticipantServer.noOfEstimatedUsers, leastNoOfParticipantServer.noOfActualUsers) + noOfEstimatedUsers);
        if (totalNumberOfUserAfterCurrentMeeting > leastNoOfParticipantServer.maxNoOfUsers) {
            canUseExitingSystem = false;
        }
        else {
            const perctange = totalNumberOfUserAfterCurrentMeeting / server.maxNoOfUsers;
            if (perctange < 0.8) {
                canUseExitingSystem = true;
            }
        }
    }

    if (canUseExitingSystem === false) {
        const standBySystemList = await database.getAllStandByServer()
        if (standBySystemList && standBySystemList !== null) {
            let standBySystemIps = Object.keys(standBySystemList)
            if(standBySystemIps.length > 1){
                let ipAddress = standBySystemIps[(standBySystemIps.length - 1)];
                return ipAddress
            }
            else if(standBySystemIps.length  === 1){

                return standBySystemIps[0]
            }
            
        }
    }

    if(leastNoOfParticipantServer !== null){
        return leastNoOfParticipantServer.ip;

    }
    CronJob.auditSystems()
    return null;

}