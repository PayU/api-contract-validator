const ajvUtils = require('./helpers/ajv-utils');
const { messages } = require('./helpers/common');
const schemaUtils = require('./helpers/schema-utils');
const responseAdapter = require('./helpers/response-adapter');

module.exports.schemaValidator = function schemaValidator(schemaPath, obj) {
  // parse the response object
  const parsedResponse = responseAdapter.parseResponse(obj);

  // validate the response object is valid
  if (!(parsedResponse instanceof Object)) {
    throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
  }

  const { request, response } = parsedResponse;
  const { path, method } = request;
  const { status } = response;
  if (!path || !method || !status) {
    throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
  }

  // get/load the schema
  const schema = schemaUtils.schemaMap[schemaPath];

  // extract the request path schema
  const pathSchema = schemaUtils.extractPathSchema(schema, request, response);
  if (!(pathSchema instanceof Object)) {
    throw new Error(`schema not found for ${JSON.stringify({ path, method, status })}`);
  }

  // validate
  const {
    predicate, actual, expected, errors,
  } = ajvUtils.validate(pathSchema, response);

  return {
    predicate,
    actual,
    expected,
    errors,
    matchMsg: messages.EXPECTED_RESPONSE_TO_MATCH_SCHEMA,
    noMatchMsg: messages.EXPECTED_RESPONSE_TO_NOT_MATCH_SCHEMA,
  };
};

module.exports.statusValidator = function statusValidator(expectedStatus, obj) {
  // parse the response object
  const parsedResponse = responseAdapter.parseResponse(obj);

  // validate the response object is valid
  if (!(parsedResponse instanceof Object)) {
    throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
  }

  const { response } = parsedResponse;
  const { status, body } = response;
  if (!status) {
    throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
  }

  // validate
  return {
    predicate: status === expectedStatus,
    actual: { status, body },
    expected: { status: expectedStatus },
    matchMsg: `expected http status code ${status} to be ${expectedStatus}`,
    noMatchMsg: `expected http status code ${status} to not be ${expectedStatus}`,
  };
};
