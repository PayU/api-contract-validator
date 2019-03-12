const validators = require('../../validators');

module.exports = (Assertion) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(schema) {
    const {
      predicate, actual, expected, matchMsg, noMatchMsg,
    } = validators.schemaValidator(schema, this._obj);

    this.assert(
      predicate,
      matchMsg,
      noMatchMsg,
      expected,
      actual,
    );
  });
};
