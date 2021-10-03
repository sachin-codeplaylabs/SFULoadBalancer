module.exports = {
    port: process.env.PORT || 4002,
    jwtsecret: 'sfuloadbalancer',
    redis: process.env.REDIS_URL ,
    cloud_vendor : process.env.CLOUD_VENDER ,
    preferred_db : process.env.PREFERRED_DB ,
    no_of_backup_machine : process.env.NO_OF_BACKUP_MACHINE_REQUIRED ,

    aws :{
        apiVersion : process.env.AWS_API_VERSION || "",
        accessKeyId:process.env.ACCESS_KEY_ID || "",
        secretAccessKey:process.env.SECRET_ACCESS_KEY || "",
        awsRegion:process.env.AWS_REGION || "",
        instanceType : process.env.AWS_INSTANCE_TYPE || "",
        keyName:process.env.AWS_KEY_NAME|| "",
        imageId:process.env.AWS_IMAGE_ID|| "",
        securityGroupId : process.env.AWS_SECURITY_GROUP_ID || "",
        securityGroupName : process.env.AWS_SECURITY_GROUP_NAME || "",
    },
    do:{
        token : process.env.DO_TOKEN || "",
        region : process.env.DO_REGION || "",
        name : process.env.DO_NAME || "",
        size : process.env.DO_SIZE || "",
        imageName: process.env.DO_IMAGE_NAME || "",
        sshKeyName: process.env.DO_SSH_KEY_NAME || "",

    }
};
  