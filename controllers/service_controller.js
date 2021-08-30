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


module.exports.getFreeIpAddress = async function(req,res){

    console.log(req.body);
    dbHandler.onNewInstanceCreated(req.body)
    res.send({ message: 'updated' });
}

