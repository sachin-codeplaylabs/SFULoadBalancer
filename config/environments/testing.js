module.exports = {
    port: process.env.PORT || 4002,
    jwtsecret: 'sfuloadbalancer',
    redis: process.env.REDIS_URL ,
    cloud_vendor : process.env.CLOUD_VENDER ,
    preferred_db : process.env.PREFERRED_DB ,
    aws :{
        apiVersion : process.env.AWS_API_VERSION || "",
        accessKeyId:process.env.ACCESS_KEY_ID || "",
        secretAccessKey:process.env.SECRET_ACCESS_KEY || "",
        awsRegion:process.env.AWS_REGION || "",
        instanceType : process.env.AWS_INSTANCE_TYPE || "",
        keyName:process.env.AWS_KEY_NAME
    },
    do:{

    }
};
  