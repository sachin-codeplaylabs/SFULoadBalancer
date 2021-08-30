const router = require('express').Router() ? require('express').Router() : {};
const controller = require("../controllers/service_controller")

router.post('/onServerStarted', controller.onServerStarted);
router.post('/onNewMeeting', controller.onNewMeeting);
router.post('/getFreeIpAddress', controller.getFreeIpAddress);


module.exports = router
