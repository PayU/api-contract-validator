const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-matcher');
const coverage = require('../../helpers/coverage');
const { messages } = require('../../helpers/common');

module.exports = function apiSchemaPlugin(options) {
  if (!(options instanceof Object) || !options.apiDefinitionsPath) {
    throw new Error(messages.REQUIRED_API_DEFINITIONS_PATH);
  }

  coverage.init(options);
  schemaMatcher(options);
  statusCodeMatcher();
};
