const validators = require('../../validators');

module.exports = (Assertion) => {
  Assertion.add('matchApiSchema', function addApiSchemaMethod(schema) {
    const {
      predicate, actual, expected, matchMsg,
    } = validators.schemaValidator(schema, this.obj);

    this.params = {
      message: matchMsg,
      expected,
      actual,
    };

    predicate.should.be.true();
  });
};
