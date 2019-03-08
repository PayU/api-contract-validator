const chai = require('chai');

const apiSchema = require('../lib/index');
const generateResponse = require('./helpers/response-generator');

chai.use(apiSchema);
const { expect } = chai;

describe('Status code matcher', () => {
  it('successful', async () => {
    const response = await generateResponse(200);
    expect(response).to.be.successful();
  });
  it('created', async () => {
    const response = await generateResponse(201);
    expect(response).to.be.created();
  });
  it('badRequest', async () => {
    const response = await generateResponse(400);
    expect(response).to.be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await generateResponse(401);
    expect(response).to.be.unauthorized();
  });
  it('rejected', async () => {
    const response = await generateResponse(403);
    expect(response).to.be.rejected();
  });
  it('notFound', async () => {
    const response = await generateResponse(404);
    expect(response).to.be.notFound();
  });
  it('serverError', async () => {
    const response = await generateResponse(500);
    expect(response).to.be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await generateResponse(503);
    expect(response).to.be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await generateResponse(504);
    expect(response).to.be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await generateResponse(204);
    expect(response).to.have.status(204);
  });
});
