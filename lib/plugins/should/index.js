const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-matcher');
const { messages } = require('../../helpers/common');

module.exports = function apiSchemaPlugin(should, options) {
  const Assertion = should.Assertion || should;

  if (!(options instanceof Object) || !options.apiDefinitionsPath) {
    throw new Error(messages.REQUIRED_API_DEFINITIONS_PATH);
  }

  schemaMatcher(Assertion, options);
  statusCodeMatcher(Assertion);
};
