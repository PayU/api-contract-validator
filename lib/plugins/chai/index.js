const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-code-matcher');

module.exports = function apiSchemaPlugin(chai) {
  const { Assertion } = chai;

  schemaMatcher(Assertion);
  statusCodeMatcher(Assertion);
};
