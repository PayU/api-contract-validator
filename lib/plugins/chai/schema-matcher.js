const validators = require('../../validators');

module.exports = (Assertion, options) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod() {
    const {
      predicate, actual, expected, matchMsg, noMatchMsg,
    } = validators.schemaValidator(this._obj, options);

    this.assert(
      predicate,
      matchMsg,
      noMatchMsg,
      expected,
      actual,
    );
  });
};
