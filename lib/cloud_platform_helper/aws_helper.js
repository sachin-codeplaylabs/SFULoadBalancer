var AWS = require('aws-sdk');
const BaseCloudHelper = require('./base_cloud');
AWS.config.update({ region: global.CONFIG.get("aws.awsRegion") });
var ec2 = new AWS.EC2({ apiVersion: global.CONFIG.get("aws.apiVersion"), accessKeyId: global.CONFIG.get("aws.accessKeyId"), secretAccessKey: global.CONFIG.get("aws.secretAccessKey") });
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();


class AwsHelper extends BaseCloudHelper {


    static isLaunchInProcess = false;
    static launchNewInstance() {
        if(AwsHelper.isLaunchInProcess){
            return;
        }
        const instanceParams = {
            ImageId: global.CONFIG.get("aws.imageId"),
            InstanceType: global.CONFIG.get("aws.instanceType"),
            KeyName: global.CONFIG.get("aws.keyName"),
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds : [global.CONFIG.get("aws.securityGroupId")],
            SecurityGroups : [global.CONFIG.get("aws.securityGroupName")],
        };
        AwsHelper.isLaunchInProcess = true;
        ec2.runInstances(instanceParams, function (err, data) {
            AwsHelper.isLaunchInProcess = false; 
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }

    static teminateInstance(ipAddress) {
        console.log("teminateInstance " , ipAddress);

        const parmas = {
            Filters: [
                {
                    Name: "ip-address",
                    Values: [ipAddress]
                }
            ]
        }
        ec2.describeInstances(parmas,  (err, data) =>{
            if (err) { console.log(err, err.stack) }
            else {

                if(data && data.Reservations && data.Reservations.length > 0 && data.Reservations[0].Instances && data.Reservations[0].Instances.length > 0){

                    const instanceId  = data.Reservations[0].Instances[0].InstanceId;
                    console.log("teminateInstance instanceId ", instanceId);

                    const instanceParams = {
                        InstanceIds: [instanceId],
            
                    };
                    ec2.terminateInstances(instanceParams,  (err, data) =>{
                        if (err) { console.log(err, err.stack) }
                        else{
                            database.deleteStandBySystem(ipAddress)
                        }

                    })

                }
                else{
                    database.deleteStandBySystem(ipAddress)

                }

            }
        });
        
    }
}

module.exports = AwsHelper