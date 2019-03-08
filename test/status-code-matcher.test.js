const chai = require('chai');

const apiSchema = require('../lib/index');
const responseGen = require('./response-generator');

chai.use(apiSchema);
const { expect } = chai;

describe('Status code matcher', () => {
  it('successful', async () => {
    const response = await responseGen(200);
    expect(response).to.be.successful();
  });
  it('created', async () => {
    const response = await responseGen(201);
    expect(response).to.be.created();
  });
  it('badRequest', async () => {
    const response = await responseGen(400);
    expect(response).to.be.badRequest();
  });
  it('unauthorized', async () => {
    const response = await responseGen(401);
    expect(response).to.be.unauthorized();
  });
  it('rejected', async () => {
    const response = await responseGen(403);
    expect(response).to.be.rejected();
  });
  it('notFound', async () => {
    const response = await responseGen(404);
    expect(response).to.be.notFound();
  });
  it('serverError', async () => {
    const response = await responseGen(500);
    expect(response).to.be.serverError();
  });
  it('serviceUnavailable', async () => {
    const response = await responseGen(503);
    expect(response).to.be.serviceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await responseGen(504);
    expect(response).to.be.gatewayTimeout();
  });
  it('custom code', async () => {
    const response = await responseGen(204);
    expect(response).to.have.status(204);
  });
});
