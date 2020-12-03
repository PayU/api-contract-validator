const should = require('should');
const path = require('path');

const apiSchema = require('../lib/index');
const { request } = require('./helpers/response-generator');
const responses = require('./data/responses');

const apiDefinitionsPath = [path.join(__dirname, 'data', 'schema-split-a.yaml'), path.join(__dirname, 'data', 'schema-split-b.yaml')];

apiSchema.shouldPlugin(should, { apiDefinitionsPath });

describe('Should.js plugin schema', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    should(response).be.successful().and.matchApiSchema();
  });
  it('Response object does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.invalid.value,
      headers: responses.headers.valid.value,
    });

    should(response).not.matchApiSchema();
  });
  it('successful', async () => {
    const response = await request({ status: 200, simple: false });
    should(response).be.successful();
  });
  it('created', async () => {
    const response = await request({ status: 201, simple: false });
    should(response).be.created();
  });
  it('badRequest', async () => {
    const response = await request({ status: 400, simple: false });
    should(response).be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await request({ status: 401, simple: false });
    should(response).be.unauthorized();
  });
  it('forbidden', async () => {
    const response = await request({ status: 403, simple: false });
    should(response).be.forbidden();
  });
  it('notFound', async () => {
    const response = await request({ status: 404, simple: false });
    should(response).be.notFound();
  });
  it('serverError', async () => {
    const response = await request({ status: 500, simple: false });
    should(response).be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await request({ status: 503, simple: false });
    should(response).be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await request({ status: 504, simple: false });
    should(response).be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await request({ status: 204, simple: false });
    should(response).have.status(204);
  });
  it('Invalid response object', () => {
    const error = 'failed to extract response details';
    should(() => should(undefined).be.gatewayTimeout()).throw(error);
    should(() => should(null).be.gatewayTimeout()).throw(error);
  });
  it('No status code in response', () => {
    should(() => should({ request: { method: 'get', path: '/pet/123' } }).be.gatewayTimeout()).throw("required properties for validating schema are missing: 'status'");
  });
  it('When pass two files with same api definition - should throw an error', () => {
    const error = 'same api definition exist in two seperated files: /v2/pet';
    const options = { apiDefinitionsPath: [apiDefinitionsPath[0], apiDefinitionsPath[0]] };
    should(() => apiSchema.shouldPlugin(should, options)).throw(error);
  });
});
