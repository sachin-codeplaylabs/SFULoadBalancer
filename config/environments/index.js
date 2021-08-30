const ENVIRONMENT = process.env.APP_ID || 'testing';
const ConfigOptions = require('./' + ENVIRONMENT.trim() + '.js') ? require('./' + ENVIRONMENT.trim() + '.js') : {};
function get(name) {
    const splitString = name.split('.');
    let obj = ConfigOptions;
    // eslint-disable-next-line prefer-const
    for (let key in splitString) {
      if (Object.prototype.hasOwnProperty.call(splitString, key)) {
        obj = obj[splitString[key]];
      }
    }
    return obj;
  }
  module.exports = {
    get: get,
  };