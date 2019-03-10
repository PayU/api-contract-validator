const chai = require('chai');

const apiSchema = require('../lib/index');
const generateResponse = require('./helpers/response-generator').supertest;
const { schema } = require('./helpers/schemas');
const { validBody, invalidBody } = require('./helpers/body-generator');

chai.use(apiSchema);
const { expect } = chai;

describe('supertest', () => {
  describe('When the response object matches the schema', () => {
    it('Should not throw an exception', async () => {
      const response = await generateResponse(200, {
        body: validBody,
        headers: {
          'content-type': 'application-json',
          'x-request-id': 'id',
        },
      });

      expect(response).to.be.successful().and.to.matchApiSchema(schema);
    });
  });

  describe('When the response object does not match the schema', () => {
    it('Should throw an exception', async () => {
      const response = await generateResponse(200, {
        body: invalidBody,
        headers: {
          'content-type': 'application-json',
          'x-request-id': 'id',
        },
      });

      expect(response).to.not.matchApiSchema(schema);
    });
  });
});
