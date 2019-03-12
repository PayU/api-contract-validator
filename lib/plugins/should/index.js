const schemaMatcher = require('./schema-matcher');
const statusCodeMatcher = require('./status-matcher');

module.exports = function apiSchemaPlugin(Assertion) {
  schemaMatcher(Assertion);
  statusCodeMatcher(Assertion);
};
