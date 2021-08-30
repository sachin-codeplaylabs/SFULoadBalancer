require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmate = require('helmet');
global.CONFIG = require('./config/environments/index');
const app = express();
// const response = require('./middlewares/response');
// const processRequest = require('./middlewares/processRequestData');
const routes = require('./routes/service.v1');
const Utility = require('./config/utilis/utilities');
const database = Utility.getDbStorageHandler();
// var cors = require('cors');
// app.use(cors());

// add security
app.use(helmate());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, identity, authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  }
  next();
});


app.use(bodyParser.json());
app.use('/api', routes);
database.connectDB();
const PORT = global.CONFIG.get('port');
app.listen(PORT, async () => {
  console.log(`Port listening at: ${PORT}`);
});
process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.info('Node NOT Exiting...');
});

