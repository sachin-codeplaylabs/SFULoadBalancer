require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const helmate = require('helmet');
global.CONFIG = require('./config/environments/index');
const app = express();
// var cors = require('cors')

// const response = require('./middlewares/response');
// const processRequest = require('./middlewares/processRequestData');
const routes = require('./routes/service.v1');
const Utility = require('./config/utilis/utilities');
const database = Utility.getDbStorageHandler();
const cornJob = require('./lib/cron_helper/cron_handler')
var cors = require('cors');
app.use(cors());

// add security

// app.use(cors())
app.use(helmate());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  }
  next();
});


app.use(bodyParser.json());
app.use('/api', routes);
database.connectDB();
cornJob.startCronJob()
const PORT = global.CONFIG.get('port');
app.listen(PORT, async () => {
  console.log(`Port listening at: ${PORT}`);
});
process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.info('Node NOT Exiting...');
});

