const router = require('express').Router() ? require('express').Router() : {};
const controller = require("../controllers/service_controller")

router.post('/onServerStarted', controller.onServerStarted);
router.post('/onNewMeeting', controller.onNewMeeting);
router.post('/onNewUserJoined', controller.onNewUserJoined);
router.post('/onUserLeft', controller.onUserLeft);
router.post('/onMeetingEnded', controller.onMeetingEnded);

router.post('/getIpAddressForMeeting', controller.getIpAddress);


module.exports = router
