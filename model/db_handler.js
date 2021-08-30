const Utility = require("../config/utilis/utilities");
const Meeting = require("./do/meeting");
const Server = require("./do/server");

const database  = Utility.getDbStorageHandler();
module.exports.onNewInstanceCreated = async function(body){
    var server = new Server()
    server.ip = body.ip
    server.maxNoOfUsers = body.maxUsers
    database.updateStandBySystem(server)
}


module.exports.onNewMeeting = async function(body){
    var meeting = new Meeting()
    meeting.serverIp = body.ip
    meeting.noOfEstimatedUsers = body.estimatedUsers
    meeting.id = body.meeting_id
    var server = await database.getStandByServerByIp(meeting.serverIp)
    console.log("standByServer" , server);
    if(!server || server === null){
        server = await database.getUsedServerByIP(meeting.serverIp)
    }
    else{
        await database.deleteStandBySystem(meeting.serverIp)
    }

    if(server && server !== null){
        server.meetings.push(meeting)
        server.noOfEstimatedUsers = server.noOfEstimatedUsers + meeting.noOfEstimatedUsers
        await database.updateInUsedSystems(server)
    }


       
}


module.exports.onNewUserJoinedMeeting = async function(body){
    let meetingId = body.meeting_id
    let ip = body.ip
    var server = await database.getStandByServerByIp(meeting.serverIp)

    var server = new Server()
    server.ip = body.ip
    server.maxNoOfUsers = body.maxUsers
    database.updateStandBySystem(server)

    database.getAllStandByServer()
    database.getAllInUseServer()
 
}