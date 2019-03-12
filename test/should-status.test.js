const should = require('should');

const apiSchema = require('../lib/index').shouldPlugin;
const generateResponse = require('./helpers/response-generator').request;

apiSchema(should.Assertion);

describe('Status code matcher', () => {
  it('successful', async () => {
    const response = await generateResponse({ status: 200 });
    should(response).be.successful();
  });
  it('created', async () => {
    const response = await generateResponse({ status: 201 });
    should(response).be.created();
  });
  it('badRequest', async () => {
    const response = await generateResponse({ status: 400 });
    should(response).be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await generateResponse({ status: 401 });
    should(response).be.unauthorized();
  });
  it('rejected', async () => {
    const response = await generateResponse({ status: 403 });
    should(response).be.rejected();
  });
  it('notFound', async () => {
    const response = await generateResponse({ status: 404 });
    should(response).be.notFound();
  });
  it('serverError', async () => {
    const response = await generateResponse({ status: 500 });
    should(response).be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await generateResponse({ status: 503 });
    should(response).be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await generateResponse({ status: 504 });
    should(response).be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await generateResponse({ status: 204 });
    should(response).have.status(204);
  });
  it('Invalid response object', () => {
    [undefined, null, {}, ''].forEach((value) => {
      should(() => should(value).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
    });
  });
  it('Response object does not contain status', () => {
    should(() => should({ request: { method: 'get', path: '/pet/123' } }).be.gatewayTimeout()).throw('expected request, axios or supertest response object');
  });
});
