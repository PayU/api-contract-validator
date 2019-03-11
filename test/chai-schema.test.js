const chai = require('chai');

const apiSchema = require('../lib/index').chaiPlugin;
const { request } = require('./helpers/response-generator');
const { schema } = require('./helpers/schemas');
const { headersObject, bodyObject } = require('./helpers/data');

chai.use(apiSchema);
const { expect } = chai;

describe('chai plugin test', () => {
  describe('When the response object matches the schema', () => {
    it('Should not throw an exception', async () => {
      const response = await request({
        status: 200,
        body: bodyObject.valid,
        headers: headersObject.valid,
      });

      expect(response).to.be.successful().and.to.matchApiSchema(schema);
    });
  });

  describe('When the response object does not match the schema', () => {
    it('Should not match the schema', async () => {
      const response = await request({
        status: 200,
        body: bodyObject.invalid,
        headers: headersObject.valid,
      });

      expect(response).to.be.successful().and.to.not.matchApiSchema(schema);
    });
  });
});
