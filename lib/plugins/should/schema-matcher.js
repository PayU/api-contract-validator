const validators = require('../../validators');

module.exports = (Assertion, options) => {
  Assertion.add('matchApiSchema', function addApiSchemaMethod(apiDefinitionsPath) {
    const {
      predicate, actual, expected, matchMsg,
    } = validators.schemaValidator(
      this.obj,
      { ...options, apiDefinitionsPath: apiDefinitionsPath || options.apiDefinitionsPath },
    );

    this.params = {
      message: matchMsg,
      expected,
      actual,
    };

    predicate.should.be.true();
  });
};
