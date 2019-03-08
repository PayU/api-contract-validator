const Ajv = require('ajv');
const { IncomingMessage } = require('http');

const ajvMappers = require('../helpers/ajv-mappers');
const httpUtils = require('../adapters');

const AJV_CONFIG = {
  allErrors: true,
  coerceTypes: 'array',
};

module.exports = (Assertion) => {
  Assertion.addMethod('matchApiSchema', function addApiSchemaMethod(schema) {
    const obj = this._obj;

    // validate that obj is IncomingMessage before parsing it
    new Assertion(obj).to.be.instanceof(IncomingMessage);
    const { response } = httpUtils.parseResponse(obj);

    const ajv = new Ajv(AJV_CONFIG);
    this.assert(
      ajv.validate(schema, response.body),
      'expected response to match API schema',
      'expected response to not match API schema',
      ajvMappers.mapErrorsByDataPath(ajv.errors),
      ajvMappers.mapValuesByDataPath(ajv.errors, obj),
    );
  });
};
