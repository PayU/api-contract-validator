const chai = require('chai');

const apiSchema = require('../lib/index').chaiPlugin;
const generateResponse = require('./helpers/response-generator').request;

chai.use(apiSchema);
const { expect } = chai;

describe('Status code matcher', () => {
  it('successful', async () => {
    const response = await generateResponse({ status: 200 });
    expect(response).to.be.successful();
  });
  it('created', async () => {
    const response = await generateResponse({ status: 201 });
    expect(response).to.be.created();
  });
  it('badRequest', async () => {
    const response = await generateResponse({ status: 400 });
    expect(response).to.be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await generateResponse({ status: 401 });
    expect(response).to.be.unauthorized();
  });
  it('rejected', async () => {
    const response = await generateResponse({ status: 403 });
    expect(response).to.be.rejected();
  });
  it('notFound', async () => {
    const response = await generateResponse({ status: 404 });
    expect(response).to.be.notFound();
  });
  it('serverError', async () => {
    const response = await generateResponse({ status: 500 });
    expect(response).to.be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await generateResponse({ status: 503 });
    expect(response).to.be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await generateResponse({ status: 504 });
    expect(response).to.be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await generateResponse({ status: 204 });
    expect(response).to.have.status(204);
  });
  it('Invalid response object', () => {
    [undefined, null, {}, ''].forEach((value) => {
      expect(() => expect(value).to.be.gatewayTimeout()).to.throw('expected request, axios or supertest response object');
    });
  });
  it('Response object does not contain status', () => {
    expect(() => expect({ request: { method: 'get', path: '/pet/123' } }).to.be.gatewayTimeout()).to.throw('expected request, axios or supertest response object');
  });
});
