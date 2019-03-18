const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-matcher');
const { messages } = require('../../helpers/common');

module.exports = function getChaiPlugin(options) {
  if (!(options instanceof Object) || !options.apiDefinitionsPath) {
    throw new Error(messages.REQUIRED_API_DEFINITIONS_PATH);
  }

  return function apiSchemaPlugin(chai) {
    const { Assertion } = chai;

    schemaMatcher(Assertion, options);
    statusCodeMatcher(Assertion);
  };
};