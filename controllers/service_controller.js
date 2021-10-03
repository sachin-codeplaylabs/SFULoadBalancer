const dbHandler = require('../model/db_handler')


module.exports.onServerStarted = async function(req,res){

    console.log(req.body);
    dbHandler.onNewInstanceCreated(req.body)
    res.send({ message: 'updated' });
}


module.exports.onNewMeeting = async function(req,res){

    console.log(req.body);
    dbHandler.onNewMeeting(req.body)
    res.send({ message: 'updated' });
}

module.exports.onNewUserJoined = async function(req,res){

    console.log(req.body);
    dbHandler.onNewUserJoined(req.body)
    res.send({ message: 'updated' });
}

module.exports.onUserLeft = async function(req,res){

    console.log(req.body);
    dbHandler.onUserLeft(req.body)
    res.send({ message: 'updated' });
}

module.exports.onMeetingEnded = async function(req,res){

    console.log(req.body);
    dbHandler.onMeetingEnded(req.body)
    res.send({ message: 'updated' });
}

module.exports.getIpAddress = async function(req,res){

    console.log("req " ,req.body);
    let ipAddress =await  dbHandler.getIpForMeeting(req.body)
    console.log(ipAddress);
    if(ipAddress !== null){
        res.send({ message: 'fetched', ipAddress : ipAddress , status : true });

    }
    else{
        res.send({ message: 'No Free Ip' , ipAddress : null , status : false });

    }
}

