const fastify = require('fastify');
const { expect, use } = require('chai');
const path = require('path');

const apiSchema = require('../lib/index');
const responses = require('./data/responses');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');

use(apiSchema.chaiPlugin({ apiDefinitionsPath }));

describe('Fastify response schema validation', () => {
  let app;
  afterEach(() => app.close());

  async function initApp({ status, body, headers }) {
    app = fastify({ logger: true });

    app.get('/v2/pet/:petId', (req, reply) => {
      reply
        .status(status)
        .headers(headers)
        .send(body);
    });

    await app.ready();
  }

  it('Response body does matches the schema', async () => {
    await initApp({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(response).to.matchApiSchema();
  });

  it('Response body does not match the schema', async () => {
    await initApp({
      status: 200,
      body: responses.body.invalid.value,
      headers: responses.headers.valid.value,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(response).not.to.matchApiSchema();
  });

  it('successful', async () => {
    await initApp({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(response)
      .to.be.successful();
  });

  it('serverError', async () => {
    await initApp({
      status: 500,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(response)
      .to.be.serverError();
  });
});
