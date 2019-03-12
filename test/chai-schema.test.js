const chai = require('chai');

const apiSchema = require('../lib/index').chaiPlugin;
const { request } = require('./helpers/response-generator');
const { schema } = require('./helpers/schemas');
const { headersObject, bodyObject } = require('./helpers/data');

chai.use(apiSchema);
const { expect } = chai;

describe('chai plugin test', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    expect(response).to.be.successful().and.to.matchApiSchema(schema);
  });
  it('Response object does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.invalid,
      headers: headersObject.valid,
    });

    expect(response).to.be.successful().and.to.not.matchApiSchema(schema);
  });
  it('Response object does not contain method', () => {
    expect(expectationTester({ path: '/pet/123', status: 200, schema }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain path', () => {
    expect(expectationTester({ method: 'get', status: 200, schema }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain status', () => {
    expect(expectationTester({ method: 'get', path: '/pet/123', schema }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Schema not given', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, schema: undefined,
    })).to.throw('schema not found for {"path":"/pet/123","method":"get","status":200}');
  });
  it('Schema is an empty object', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, schema: {},
    })).to.throw('schema not found for {"path":"/pet/123","method":"get","status":200}');
  });
});

function expectationTester({
  path, method, status, schema,
}) {
  return () => expect({ request: { method, path }, statusCode: status }).to.matchApiSchema(schema);
}
