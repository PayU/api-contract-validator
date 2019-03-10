const Ajv = require('ajv');

const ajvUtils = require('../helpers/ajv-utils');
const schemaUtils = require('../helpers/schema-utils');
const responseAdapter = require('../adapters/response-adapter');

const AJV_CONFIG = {
  allErrors: true,
  coerceTypes: 'array',
};

module.exports = (Assertion) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(schema) {
    const { _obj } = this;

    const ajv = new Ajv(AJV_CONFIG);
    const { request, response } = responseAdapter.parseResponse(_obj);
    const pathSchema = schemaUtils.extractPathSchema(schema, request, response);

    this.assert(
      ajv.validate(pathSchema, response.body),
      'expected response to match API schema',
      'expected response to not match API schema',
      ajvUtils.mapErrorsByDataPath(ajv.errors),
      ajvUtils.mapValuesByDataPath(ajv.errors, response),
    );
  });
};
