const ajvUtils = require('../../helpers/ajv-utils');
const schemaUtils = require('../../helpers/schema-utils');
const responseAdapter = require('../../adapters/response-adapter');
const { messages } = require('../../helpers/common');

module.exports = (Assertion) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(schema) {
    const { _obj } = this;

    const parsedResponse = responseAdapter.parseResponse(_obj);
    // this.assert(
    //   parsedResponse instanceof Object,
    //   'expected request, axios or supertest response object',
    // );

    const { request, response } = parsedResponse;
    const { path, method } = request;
    const { status } = response;
    const pathSchema = schemaUtils.extractPathSchema(schema, request, response);
    // this.assert(
    //   pathSchema instanceof Object,
    //   `expected schema not found for ${JSON.stringify({ path, method, status })}`,
    // );

    const { predicate, actual, expected } = ajvUtils.validate(pathSchema, response);

    this.assert(
      predicate,
      messages.EXPECTED_RESPONSE_TO_MATCH_SCHEMA,
      messages.EXPECTED_RESPONSE_TO_NOT_MATCH_SCHEMA,
      expected,
      actual,
    );
  });
};
