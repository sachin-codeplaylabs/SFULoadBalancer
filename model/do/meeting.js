class Meeting{
    constructor(){
        this.id = "";
        this.noOfEstimatedUsers = 0;
        this.noOfActualUsers = 0;
        this.serverIp = "";
        this.createdOn = (new Date()).getTime();
    }
}

module.exports = Meeting;