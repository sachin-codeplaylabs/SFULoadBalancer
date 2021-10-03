const BaseCloudHelper = require('./base_cloud');
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const axios = require('axios')
const CronJob = require('../../lib/cron_helper/cron_handler')

class DigitalOceanHelper extends BaseCloudHelper {


    static isLaunchInProcess = false;
    static isSSHKeyFetchInProgress = false;
    static sshkeyId = null;
    static imageId = null;

    static launchNewInstance() {
        if (DigitalOceanHelper.isLaunchInProcess) {
            return;
        }
        if(DigitalOceanHelper.sshkeyId === null || DigitalOceanHelper.imageId === null){
            DigitalOceanHelper.updateSSHKey()
            return;
        }
        console.log("launchNewInstance do");
        DigitalOceanHelper.isLaunchInProcess = true
        const authString = 'Bearer '.concat(global.CONFIG.get('do.token'));


        axios.default.post('https://api.digitalocean.com/v2/droplets', {
            "name": global.CONFIG.get('do.name'),
            "region": global.CONFIG.get('do.region'),
            "size": global.CONFIG.get('do.size'),
            "image": DigitalOceanHelper.imageId,
            "tags": [
                "VaniMeeting"
            ],

            "ssh_keys" :[
                DigitalOceanHelper.sshkeyId 
            ]
            
        }, { headers: { Authorization: authString } }).then((data) => {
            DigitalOceanHelper.isLaunchInProcess = false
            console.log(data.data)
        }).catch((error) => {
            DigitalOceanHelper.isLaunchInProcess = false
            console.log(error)
        })


        
    }

    static teminateInstance(ipAddress) {
        console.log("teminateInstance  DO ", ipAddress);


        const authString = 'Bearer '.concat(global.CONFIG.get('do.token'));
        
        axios.default.get('https://api.digitalocean.com/v2/droplets?tag_name=VaniMeeting&per_page=500&page=1', { headers: { Authorization: authString } }).then((data) => {
            console.log(data.data)

            var dropletId = null
            if(data && data.data && data.data.droplets){
                for(let droplet of data.data.droplets){
                    if(droplet.networks && droplet.networks !== null && droplet.networks.v4 && droplet.networks.v4 !== null){
                        for(let v4 of droplet.networks.v4){
                            if(v4 && v4.ip_address && v4.ip_address !== null &&  v4.ip_address === ipAddress){
                                dropletId = droplet.id
                                break;
                            }
                        }
                    }
                    
                    if(dropletId !== null){
                        break;
                    }

                }
            }

            if(dropletId !== null){


                axios.default.delete('https://api.digitalocean.com/v2/droplets/' + dropletId, { headers: { Authorization: authString } }).then((data) => {
                    console.log(data.data)
                    database.deleteStandBySystem(ipAddress)
        
                }).catch((error) => {
        
                })
            }
            else{
                database.deleteStandBySystem(ipAddress)
            }

        }).catch((error) => {

        })

    }


    static updateSSHKey(){
        if(DigitalOceanHelper.isSSHKeyFetchInProgress ){
            return;
        }
        DigitalOceanHelper.isSSHKeyFetchInProgress = true;
        const authString = 'Bearer '.concat(global.CONFIG.get('do.token'));
        axios.default.get('https://api.digitalocean.com/v2/account/keys', { headers: { Authorization: authString } }).then((data) => {
            if(data && data.data && data.data.ssh_keys && data.data.ssh_keys !== null){
                for(let sshKey of data.data.ssh_keys){
                    if(sshKey && sshKey !== null && sshKey.name && sshKey.name !== null && sshKey.name === global.CONFIG.get('do.sshKeyName')){
                        DigitalOceanHelper.sshkeyId = sshKey.id;

                        DigitalOceanHelper.getImageId();
                        break;
                    }
                }
            }
        }).catch((error) => {
            DigitalOceanHelper.isSSHKeyFetchInProgress = false;
        })
    }

    static getImageId(){
        DigitalOceanHelper.isSSHKeyFetchInProgress = true;
        const authString = 'Bearer '.concat(global.CONFIG.get('do.token'));
        axios.default.get('https://api.digitalocean.com/v2/images?page=1&per_page=500&private=true', { headers: { Authorization: authString } }).then((data) => {
            console.log(data.data);
            if(data && data.data && data.data.images && data.data.images !== null){
                for(let image of data.data.images){
                    if(image && image !== null && image.name && image.name !== null && image.name === global.CONFIG.get('do.imageName')){
                        console.log(global.CONFIG.get('do.imageName'));

                        DigitalOceanHelper.isSSHKeyFetchInProgress = false;
                        DigitalOceanHelper.imageId = image.id;
                        CronJob.auditSystems()
                        break;
                    }
                }
            }
        }).catch((error) => {
            DigitalOceanHelper.isSSHKeyFetchInProgress = false;
        })
    }
}

module.exports = DigitalOceanHelper