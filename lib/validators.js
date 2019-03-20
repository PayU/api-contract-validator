const ajvUtils = require('./helpers/ajv-utils');
const { messages } = require('./helpers/common');
const schemaUtils = require('./helpers/schema-utils');
const responseAdapter = require('./helpers/response-adapter');

module.exports.schemaValidator = function schemaValidator(obj, options = {}) {
  const { apiDefinitionsPath } = options;

  // load the schema
  if (!apiDefinitionsPath) {
    throw new Error(messages.REQUIRED_API_DEFINITIONS_PATH);
  }
  const schema = schemaUtils.schemaMap[apiDefinitionsPath];

  // parse the response object
  const parsedResponse = responseAdapter.parseResponse(obj);

  // validate the response object
  if (!(parsedResponse instanceof Object)) {
    throw new Error(messages.FAILED_TO_EXTRACT_RESPONSE_DETAILS);
  }

  const { request, response } = parsedResponse;
  const { path, method } = request;
  const { status } = response;

  const missingRequestProps = ['path', 'method'].filter(prop => request[prop] === undefined);
  const missingResponseProps = ['status'].filter(prop => response[prop] === undefined);
  if (missingRequestProps.length > 0 || missingResponseProps.length > 0) {
    const missingProps = missingRequestProps
      .concat(missingResponseProps)
      .map(prop => `'${prop}'`)
      .join(', ');
    throw new Error(`required properties for validating schema are missing: ${missingProps}`);
  }

  // extract the request path schema
  const validator = schemaUtils.getValidatorByPathMethodAndCode(schema, request, response);
  if (!(validator instanceof Object) || !(validator.validate instanceof Function)) {
    throw new Error(`schema not found for ${JSON.stringify({ path, method, status })}`);
  }

  // validate
  const predicate = validator.validate(response);
  const { actual, expected } = ajvUtils.parseErrors(validator.errors, response);

  schemaUtils.markCovered(apiDefinitionsPath, { path, method, status });

  return {
    predicate,
    actual,
    expected,
    errors: validator.errors,
    matchMsg: messages.EXPECTED_RESPONSE_TO_MATCH_SCHEMA,
    noMatchMsg: messages.EXPECTED_RESPONSE_TO_NOT_MATCH_SCHEMA,
  };
};

module.exports.statusValidator = function statusValidator(expectedStatus, obj) {
  // parse the response object
  const parsedResponse = responseAdapter.parseResponse(obj);

  // validate the response object is valid
  if (!(parsedResponse instanceof Object)) {
    throw new Error(messages.FAILED_TO_EXTRACT_RESPONSE_DETAILS);
  }

  const { response } = parsedResponse;
  const { status, body } = response;

  if (!status) {
    throw new Error("required properties for validating schema are missing: 'status'");
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
