const chai = require('chai');

const apiSchema = require('../lib/index').chaiPlugin;
const generateResponse = require('./helpers/response-generator').request;
const { schema } = require('./helpers/schemas');
const { headersObject, bodyObject } = require('./helpers/data');

chai.use(apiSchema);
const { expect } = chai;

describe('request', () => {
  describe('When the response object matches the schema', () => {
    it('Should not throw an exception', async () => {
      const response = await generateResponse({
        status: 200,
        body: bodyObject.valid,
        headers: headersObject.valid,
      });

      expect(response).to.be.successful().and.to.matchApiSchema(schema);
    });
  });

  describe('When the response object does not match the schema', () => {
    it('Should throw an exception', async () => {
      const response = await generateResponse({
        status: 200,
        body: bodyObject.invalid,
        headers: headersObject.invalid,
      });

      expect(response).to.not.matchApiSchema(schema);
    });
  });

  // TODO: test mapErrorsByDataPath directly instead
  describe('When the response is missing multiple required props', () => {
    it('Should return an array of required props', async () => {
      const response = await generateResponse({
        status: 200,
        body: { ...bodyObject.invalid, lastName: undefined },
        headers: headersObject.valid,
      });

      expect(response).to.not.matchApiSchema(schema);
    });
  });
});
