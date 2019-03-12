const chai = require('chai');
const chaiLike = require('chai-like');

const schema = require('./data/a-schema');
const { bodyObject, headersObject } = require('./helpers/data');
const { validate } = require('../lib/helpers/ajv-utils');

chai.use(chaiLike);
const { expect } = chai;

describe('ajv validation', () => {
  it('Object does not match the schema', () => {
    expect(validate(schema, {
      headers: headersObject.invalid,
      body: bodyObject.invalid,
    })).to.eql({
      predicate: false,
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

  it('And the object matches the schema', () => {
    expect(validate(schema, {
      headers: headersObject.valid,
      body: bodyObject.valid,
    })).to.eql({
      predicate: true,
      actual: null,
      expected: null,
    });
  });
});
