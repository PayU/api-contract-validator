const schemaMatcher = require('./matchers/schema-matcher');
const statusCodeMatcher = require('./matchers/status-code-matcher');

module.exports = function apiSchemaPlugin(chai) {
  const { Assertion } = chai;

  schemaMatcher(Assertion);
  statusCodeMatcher(Assertion);
};
