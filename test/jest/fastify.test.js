const fastify = require('fastify');
const path = require('path');

const { schemaValidator } = require('../../lib').validators;
const responses = require('../data/responses');
const apiSchema = require('../../lib');

const apiDefinitionsPath = path.join(__dirname, '../data', 'schema.yaml');
apiSchema.jestPlugin({ apiDefinitionsPath });

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


  it('Response headers and body matches the schema', async () => {
    await initApp({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(schemaValidator(response, { apiDefinitionsPath }))
      .toMatchObject({
        actual: null,
        errors: null,
        expected: null,
        matchMsg: 'expected response to match API schema',
        noMatchMsg: 'expected response to not match API schema',
        predicate: true,
      });
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

    expect(response).not.toMatchApiSchema();
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
      .toBeSuccessful();
  });

  it('serverError', async () => {
    await initApp({
      status: 500,
    });
    const response = await app.inject()
      .get('/v2/pet/123')
      .end();

    expect(response)
      .toBeServerError();
  });
});
