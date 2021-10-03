class Utility{

    static getCloudVendor(){
        if(global.CONFIG.get('cloud_vendor') === "aws"){
            return require("../../lib/cloud_platform_helper/aws_helper")
        }
        else  if(global.CONFIG.get('cloud_vendor') === "do"){
            return require("../../lib/cloud_platform_helper/do_helper")
        }

    }

    static getDbStorageHandler(){
        if(global.CONFIG.get('preferred_db') === "redis"){
            return require("../../lib/database/redis")
        }
       
    }
}


module.exports = Utility;