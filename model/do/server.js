class Server{
    constructor(){
        this.ip = "";
        this.maxNoOfUsers = 0;
        this.noOfEstimatedUsers = 0;
        this.noOfActualUsers = 0;
        this.meetings = []
        this.createdOn = (new Date()).getMilliseconds();
    }
}

module.exports = Server;