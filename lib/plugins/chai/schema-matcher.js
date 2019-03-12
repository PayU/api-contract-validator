const ajvUtils = require('../../helpers/ajv-utils');
const schemaUtils = require('../../helpers/schema-utils');
const responseAdapter = require('../../adapters/response-adapter');
const { messages } = require('../../helpers/common');

module.exports = (Assertion) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(schema) {
    const { _obj } = this;

    const parsedResponse = responseAdapter.parseResponse(_obj);
    if (!(parsedResponse instanceof Object)) {
      throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
    }

    const { request, response } = parsedResponse;
    const { path, method } = request;
    const { status } = response;

    if (!path || !method || !status) {
      throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
    }

    const pathSchema = schemaUtils.extractPathSchema(schema, request, response);
    if (!(pathSchema instanceof Object)) {
      throw new Error(`schema not found for ${JSON.stringify({ path, method, status })}`);
    }

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
