const validators = require('../../validators');

module.exports = (Assertion, options) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(apiDefinitionsPath) {
    const {
      predicate, actual, expected, matchMsg, noMatchMsg,
    } = validators.schemaValidator(
      this._obj,
      { ...options, apiDefinitionsPath: apiDefinitionsPath || options.apiDefinitionsPath },
    );

    this.assert(
      predicate,
      matchMsg,
      noMatchMsg,
      expected,
      actual,
    );
  });
};
