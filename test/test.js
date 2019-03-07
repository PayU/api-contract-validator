const rp = require('request-promise-native');
const nock = require('nock');
const chai = require('chai');

const apiSchema = require('../lib/index');

const { expect } = chai;

chai.use(apiSchema);

describe('When given ', () => {
  it('very basic', async () => {
    nock(/./).get('/').reply(200, {
      // firstName: 'Adam',
      lastName: 'Driver',
      age: -1,
    }, {
      'content-type': 'application-json',
      'x-request-id': 'id',
    });
    const response = await rp.get('http://www.dsasdsa.com', {
      resolveWithFullResponse: true,
      json: true,
    });

    expect(response).to.have.apiSchema({
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: "The person's first name.",
        },
        lastName: {
          type: 'integer',
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
  });
});
