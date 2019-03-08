const chai = require('chai');

const apiSchema = require('../lib/index');
const generateResponse = require('./helpers/response-generator');

chai.use(apiSchema);
const { expect } = chai;

describe('When the response object matches the schema', () => {
  it('Should not throw an exception', async () => {
    const response = await generateResponse(200, {
      body: {
        firstName: 'Adam',
        lastName: 'Driver',
        age: 30,
      },
      headers: {
        'content-type': 'application-json',
        'x-request-id': 'id',
      },
    });

    expect(response).to.be.successful().and.to.matchApiSchema(schema);
  });
});

describe('When the response object does not match the schema', () => {
  it('Should throw an exception', async () => {
    const response = await generateResponse(200, {
      body: {
        lastName: 'Driver',
        age: -5,
      },
      headers: {
        'content-type': 'application-json',
        'x-request-id': 'id',
      },
    });

    expect(response).to.not.matchApiSchema(schema);
  });
});

// TODO: test mapErrorsByDataPath directly instead
describe('When the response is missing multiple required props', () => {
  it('Should return an array of required props', async () => {
    const response = await generateResponse(200, {
      body: {
        age: -5,
      },
      headers: {
        'content-type': 'application-json',
        'x-request-id': 'id',
      },
    });

    expect(response).to.not.matchApiSchema(schema);
  });
});

const schema = Object.freeze({
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
      minLen: 5,
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
    },
    age: {
      description: 'Age in years which must be equal to or greater than zero.',
      type: 'integer',
      minimum: 0,
    },
  },
  required: ['firstName', 'lastName'],
});
