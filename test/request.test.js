const rp = require('request-promise-native');
const nock = require('nock');
const chai = require('chai');

const apiSchema = require('../lib/index');

chai.use(apiSchema);
const { expect } = chai;

describe('When the response object matches the schema', () => {
  it('Should not throw an exception', async () => {
    nock(/./).get('/').reply(200, {
      firstName: 'Adam',
      lastName: 'Driver',
      age: 30,
    }, {
      'content-type': 'application-json',
      'x-request-id': 'id',
    });
    const response = await rp.get('http://www.dsasdsa.com', {
      resolveWithFullResponse: true,
      json: true,
    });

    expect(response).to.be.successful().and.to.matchApiSchema(schema);
  });
});

describe('When the response object does not match the schema', () => {
  it('Should throw an exception', async () => {
    nock(/./).get('/').reply(200, {
      lastName: 'Driver',
      age: -5,
    }, {
      'content-type': 'application-json',
      'x-request-id': 'id',
    });

    const response = await rp.get('http://www.dsasdsa.com', {
      resolveWithFullResponse: true,
      json: true,
    });

    expect(response).to.not.matchApiSchema(schema);
  });
});

const schema = {
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
};
