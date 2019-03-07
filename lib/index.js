const Ajv = require('ajv');
const { IncomingMessage } = require('http');

const requestAdapter = require('./adapters/request');
const { getErrorsByDataPath, getValuesByDataPath } = require('./helpers/ajv-parser');


module.exports = function apiSchemaPlugin(chai, utils) {
  const { Assertion } = chai;
  const ajv = new Ajv({
    allErrors: true,
    coerceTypes: 'array',
  });

  function validateSchema(obj, schema) {
    const { response } = requestAdapter(obj);
    return ajv.validate(schema, response.body);
  }

  Assertion.addMethod('apiSchema', function addApiSchemaMethod(schema) {
    const obj = this._obj;

    new Assertion(obj).to.be.instanceof(IncomingMessage);

    const result = validateSchema(obj, schema);
    const errors = getErrorsByDataPath(ajv.errors);
    const actual = getValuesByDataPath(ajv.errors, obj);

    this.assert(
      result,
      'Expected to match API schema', // \n\t- ${parseAjvErrors(ajv.errors).join('\n\t- ')}`,
      'Expected to not match API schema',
      errors,
      actual,
    );
  });
};
