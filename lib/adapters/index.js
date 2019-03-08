const requestAdapter = require('./request');

module.exports.parseResponse = function parseResponse(obj) {
  return requestAdapter(obj);
};
