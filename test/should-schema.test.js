const should = require('should');
const path = require('path');

const apiSchema = require('../lib/index').shouldPlugin;
const { request } = require('./helpers/response-generator');
const responses = require('./data/responses');

const schemaPath = path.join(__dirname, 'data', 'schema.yaml');

apiSchema(should.Assertion);

describe('Should.js plugin schema test', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    should(response).be.successful().and.matchApiSchema(schemaPath);
  });
  it('Response object does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.invalid.value,
      headers: responses.headers.valid.value,
    });

    should(response).not.matchApiSchema(schemaPath);
  });
  it('Response object does not contain method', () => {
    should(expectationTester({ path: '/pet/123', status: 200, schemaPath }))
      .throw('expected request, axios or supertest response object');
  });
  it('successful', async () => {
    const response = await request({ status: 200 });
    should(response).be.successful();
  });
  it('created', async () => {
    const response = await request({ status: 201 });
    should(response).be.created();
  });
  it('badRequest', async () => {
    const response = await request({ status: 400 });
    should(response).be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await request({ status: 401 });
    should(response).be.unauthorized();
  });
  it('forbidden', async () => {
    const response = await request({ status: 403 });
    should(response).be.forbidden();
  });
  it('notFound', async () => {
    const response = await request({ status: 404 });
    should(response).be.notFound();
  });
  it('serverError', async () => {
    const response = await request({ status: 500 });
    should(response).be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await request({ status: 503 });
    should(response).be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await request({ status: 504 });
    should(response).be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await request({ status: 204 });
    should(response).have.status(204);
  });
  it('Invalid response object', () => {
    should(() => should(undefined).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
    should(() => should(null).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
    should(() => should({}).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
    should(() => should('').be.gatewayTimeout()).throw('expected request, axios or supertest response object');
  });
  it('No status code in response', () => {
    should(() => should({ request: { method: 'get', path: '/pet/123' } }).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
  });
});

function expectationTester({
  path, method, status, schemaPath,
}) {
  return function matchApiSchema() {
    should({ request: { method, path }, statusCode: status }).matchApiSchema(schemaPath);
  };
}
