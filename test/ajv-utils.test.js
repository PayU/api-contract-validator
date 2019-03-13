const { expect, use } = require('chai');
const chaiLike = require('chai-like');

const responses = require('./data/responses');
const errors = require('./data/errors');
const { parseErrors } = require('../lib/helpers/ajv-utils');

use(chaiLike);

describe('ajv error parsing', () => {
  it('No errors were found', () => {
    expect(parseErrors(null, {
      headers: responses.body.valid.value,
      body: responses.headers.valid.value,
    })).to.eql({
      actual: null,
      expected: null,
    });
  });
  it('Errors were found', () => {
    expect(parseErrors(errors, {
      body: responses.body.invalid.value,
      headers: responses.headers.invalid.value,
    })).to.eql({
      actual: {
        body: {
          age: -1,
          details: {
            food: 'abc',
          },
        },
        headers: {
          'x-request-id': '123',
        },
      },
      expected: {
        body: {
          age: 'should be >= 0',
          name: 'should have required property',
          details: {
            food: 'should NOT be shorter than 4 characters',
            location: 'should have required property',
          },
        },
        headers: {
          'x-elapsed-time': 'should have required property',
          'x-request-id': 'should NOT be shorter than 4 characters',
        },
      },
    });
  });
});
