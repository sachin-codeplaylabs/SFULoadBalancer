var AWS = require('aws-sdk');
AWS.config.update({ region: global.CONFIG.get("aws.awsRegion") });
var ec2 = new AWS.EC2({ apiVersion: global.CONFIG.get("aws.apiVersion"), accessKeyId: global.CONFIG.get("aws.ACCESS_KEY_ID"), secretAccessKey: global.CONFIG.get("aws.SECRET_ACCESS_KEY") });

class AwsHelper{

    static launchNewInstance(imageId){
        const instanceParams = {
            ImageId: imageId,
            InstanceType: global.CONFIG.get("aws.instanceType"),
            KeyName: global.CONFIG.get("aws.keyName"),
            MinCount: 1,
            MaxCount: 1
        };

        var instancePromise = ec2.runInstances(instanceParams).promise();

    }

    static teminateInstance(instanceId){
        const instanceParams = {
            InstanceIds: [instanceId],
           
        };
        var instancePromise = ec2.teminateInstance(instanceParams).promise();
    }
}

module.exports = AwsHelper