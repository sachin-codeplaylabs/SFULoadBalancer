const cron = require('node-cron');
const Utility = require('../../config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const BaseCloudHelper = Utility.getCloudVendor()
var isAuditInProgress = false;
module.exports.startCronJob = async function () {

    cron.schedule('*/5 * * * *', () => {
        onCronTask()
    });

}


module.exports.auditSystems = async function () {
    onCronTask()
}

async function onCronTask() {
    if (isAuditInProgress) {
        return;
    }

    isAuditInProgress = true;
    const standBySystemList = await database.getAllStandByServer()
    let standBySystemIps = Object.keys(standBySystemList)
    if (global.CONFIG.get('no_of_backup_machine') > standBySystemIps.length) {
        BaseCloudHelper.launchNewInstance()

    }
    else if (global.CONFIG.get('no_of_backup_machine') < standBySystemIps.length) {
        if(standBySystemIps.length > 0){
            BaseCloudHelper.teminateInstance(standBySystemIps[0])
        }
    }

    isAuditInProgress = false
}