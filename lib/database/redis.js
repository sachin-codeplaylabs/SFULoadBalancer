const redis = require("redis");
const util = require('util')
var redisClient = null;
var hmgetPromisfy = null;
module.exports.connectDB = async function () {

    console.log(global.CONFIG.get("redis"));
    redisClient = redis.createClient(global.CONFIG.get("redis"));
    redisClient.on('ready', () => {
        console.info('Redis is ready to accept connections.')
    });
    redisClient.on('connect', (data) => {
        console.info('Redis has been connected successfully.', data)
        hmgetPromisfy = util.promisify(redisClient.hgetall).bind(redisClient);

    });
    redisClient.on('end', (err) => {
        console.error('Redis connection has been closed.', err);
    });
    redisClient.on('error', (err) => {
        console.error('Unknown exception occurred at Redis', err);
    });
}
module.exports.deleteStandBySystem = async function(ip){

    redisClient.hdel("standBySystems",ip)
    
}

module.exports.updateStandBySystem = async function(standBySystemObj){

    let jsonStandBySystem = JSON.stringify(standBySystemObj)
    const dictionary = {};
    dictionary[standBySystemObj.ip] = jsonStandBySystem
    redisClient.hmset("standBySystems",dictionary)
    
}

module.exports.getAllStandByServer = async function(){
    let standBySystemList = await hmgetPromisfy("standBySystems");
    console.log("standBySystemList ", standBySystemList);
    if(!standBySystemList || standBySystemList === null){
        return {};
    }
    return standBySystemList;
    
}
module.exports.getStandByServerByIp = async function(ip){
    
    let standBySystemList = await hmgetPromisfy("standBySystems");
    if(standBySystemList && standBySystemList !== null){
        for(let ipAddress of Object.keys(standBySystemList)){
            if(ipAddress === ip){
                return JSON.parse(standBySystemList[ipAddress]);
            }
        }
    }
    return null;
    
}
module.exports.getAllInUseServer = async function(){
    let usedSystems = await hmgetPromisfy("usedSystems");
    console.log("getAllInUseServer ", usedSystems);
    if(!usedSystems || usedSystems === null){
        return {};
    }
    return usedSystems;
}
module.exports.updateInUsedSystems = async function(server){
    
    let jsonServer = JSON.stringify(server)
    const dictionary = {};
    dictionary[server.ip] = jsonServer
    redisClient.hmset("usedSystems",dictionary)
    
}
module.exports.getUsedServerByIP = async function(ip){
    
    let usedSystems = await hmgetPromisfy("usedSystems");
    if(usedSystems && usedSystems !== null){
        for(let ipAddress of Object.keys(usedSystems)){
            if(ipAddress === ip){
                return JSON.parse(usedSystems[ipAddress]);
            }
        }
    }
    return null;

}


module.exports.deleteInUseServer = async function(ip){

    redisClient.hdel("usedSystems",ip)
    
}

module.exports.updateMeetingByMeetingId = async function(meeting){
    let jsonServer = JSON.stringify(meeting)
    const dictionary = {};
    dictionary[meeting.id] = jsonServer
    redisClient.hmset("meetings",dictionary)
    
}

module.exports.getMeetingById = async function(meetingId){
    
    let meetings = await hmgetPromisfy("meetings");
    // console.log("meetings[meetingId]");
    // console.log(meetings[meetingId]);
    if(meetings && meetings !== null){
        return meetings[meetingId];
    }
    return null;

}
module.exports.deleteMeeting = async function(meetingId){

    redisClient.hdel("meetings",meetingId)
    
}