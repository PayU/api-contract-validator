const { expect, use } = require('chai');
const path = require('path');

const apiSchema = require('../lib/index');
const { request } = require('./helpers/response-generator');
const responses = require('./data/responses');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');

use(apiSchema.chaiPlugin({ apiDefinitionsPath }));

describe('Chai.js plugin schema', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: { ...responses.body.valid.value },
      headers: { ...responses.headers.valid.value },
    });

    expect(response).to.matchApiSchema();
  });

  it('Response object matches the schema', async () => {
    expect({
      method: 'get',
      status: 200,
      path: '/v2/pet/123',
      body: { ...responses.body.valid.value },
      headers: { ...responses.headers.valid.value },
    }).to.matchApiSchema();
  });

  it('Response body does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: { ...responses.body.invalid.value },
      headers: { ...responses.headers.valid.value },
    });

    expect(response).to.not.matchApiSchema();
  });
  it('successful', async () => {
    const response = await request({ status: 200, simple: false });
    expect(response).to.be.successful();
  });
  it('created', async () => {
    const response = await request({ status: 201, simple: false });
    expect(response).to.be.created();
  });
  it('badRequest', async () => {
    const response = await request({ status: 400, simple: false });
    expect(response).to.be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await request({ status: 401, simple: false });
    expect(response).to.be.unauthorized();
  });
  it('forbidden', async () => {
    const response = await request({ status: 403, simple: false });
    expect(response).to.be.forbidden();
  });
  it('notFound', async () => {
    const response = await request({ status: 404, simple: false });
    expect(response).to.be.notFound();
  });
  it('serverError', async () => {
    const response = await request({ status: 500, simple: false });
    expect(response).to.be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await request({ status: 503, simple: false });
    expect(response).to.be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await request({ status: 504, simple: false });
    expect(response).to.be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await request({ status: 204, simple: false });
    expect(response).to.have.status(204);
  });
  it('No status code in response', () => {
    expect(() => expect({ request: { method: 'get', path: '/pet/123' } }).to.be.gatewayTimeout()).to.throw("required properties for validating schema are missing: 'status'");
  });
  it('apiDefinitionsPath is missing', () => {
    const error = "'apiDefinitionsPath' is required";
    expect(() => apiSchema.chaiPlugin()).to.throw(error);
    expect(() => apiSchema.chaiPlugin({ apiDefinitionsPath: undefined })).to.throw(error);
  });
});
