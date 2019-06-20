const path = require('path');

const apiSchema = require('../../lib');
const { request } = require('../helpers/response-generator');
const responses = require('../data/responses');

const apiDefinitionsPath = path.join(__dirname, '..', 'data', 'schema.yaml');
apiSchema.jestPlugin({ apiDefinitionsPath });

describe('Jest plugin schema', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(response)
      .toMatchApiSchema();
  });

  it('Response object matches the schema', async () => {
    expect({
      method: 'get',
      status: 200,
      path: '/v2/pet/123',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    })
      .toMatchApiSchema();
  });

  it('Response body does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.invalid.value,
      headers: responses.headers.valid.value,
    });

    expect(response).not.toMatchApiSchema();
  });
  it('successful', async () => {
    const response = await request({
      status: 200,
      simple: false,
    });
    expect(response)
      .toBeSuccessful();
  });
  it('created', async () => {
    const response = await request({
      status: 201,
      simple: false,
    });
    expect(response)
      .toBeCreated();
  });
  it('badRequest', async () => {
    const response = await request({
      status: 400,
      simple: false,
    });
    expect(response)
      .toBeBadRequest();
  });
  it('unauthorized', async () => {
    const response = await request({
      status: 401,
      simple: false,
    });
    expect(response)
      .toBeUnauthorized();
  });
  it('forbidden', async () => {
    const response = await request({
      status: 403,
      simple: false,
    });
    expect(response)
      .toBeForbidden();
  });
  it('notFound', async () => {
    const response = await request({
      status: 404,
      simple: false,
    });
    expect(response)
      .toBeNotFound();
  });
  it('serverError', async () => {
    const response = await request({
      status: 500,
      simple: false,
    });
    expect(response)
      .toBeServerError();
  });
  it('serviceUnavailable', async () => {
    const response = await request({
      status: 503,
      simple: false,
    });
    expect(response)
      .toBeServiceUnavailable();
  });
  it('gatewayTimeout', async () => {
    const response = await request({
      status: 504,
      simple: false,
    });
    expect(response)
      .toBeGatewayTimeout();
  });
  it('custom code', async () => {
    const response = await request({
      status: 204,
      simple: false,
    });
    expect(response)
      .toHaveStatus(204);
  });
  it('No status code in response', () => {
    expect(() => expect({
      request: {
        method: 'get',
        path: '/pet/123',
      },
    })
      .toBeGatewayTimeout())
      .toThrow('required properties for validating schema are missing: \'status\'');
  });
  it('apiDefinitionsPath is missing', () => {
    const error = '\'apiDefinitionsPath\' is required';
    expect(() => apiSchema.jestPlugin())
      .toThrow(error);
    expect(() => apiSchema.jestPlugin({ apiDefinitionsPath: undefined }))
      .toThrow(error);
  });
});
