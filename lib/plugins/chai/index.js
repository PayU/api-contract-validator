const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-matcher');

module.exports = function apiSchemaPlugin(chai) {
  const { Assertion } = chai;

  schemaMatcher(Assertion);
  statusCodeMatcher(Assertion);
};
