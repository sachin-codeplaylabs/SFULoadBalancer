class Utility{

    static getCloudVendor(){
        if(global.CONFIG.get('cloud_vendor') === "aws"){
            return require("../../lib/aws_helper")
        }
        else  if(global.CONFIG.get('cloud_vendor') === "do"){
            return require("../../lib/do_helper")
        }

    }

    static getDbStorageHandler(){
        if(global.CONFIG.get('preferred_db') === "redis"){
            return require("../../lib/redis")
        }
       
    }
}


module.exports = Utility;