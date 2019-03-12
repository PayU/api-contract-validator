const { expect, use } = require('chai');
const chaiLike = require('chai-like');

const schema = require('./data/a-schema');
const { bodyObject, headersObject } = require('./data/responses');
const { validate } = require('../lib/helpers/ajv-utils');

use(chaiLike);

describe('ajv validation', () => {
  it('And the object matches the schema', () => {
    expect(validate(schema, {
      headers: headersObject.valid,
      body: bodyObject.valid,
    })).to.eql({
      predicate: true,
      actual: null,
      expected: null,
      errors: null,
    });
  });
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
      errors: [
        {
          dataPath: ".headers['x-request-id']",
          keyword: 'minLength',
          message: 'should NOT be shorter than 4 characters',
          params: {
            limit: 4,
          },
          schemaPath: '#/properties/headers/properties/x-request-id/minLength',
        },
        {
          dataPath: '.headers',
          keyword: 'required',
          message: "should have required property 'x-elapsed-time'",
          params: {
            missingProperty: 'x-elapsed-time',
          },
          schemaPath: '#/properties/headers/required',
        },
        {
          dataPath: '.body',
          keyword: 'required',
          message: "should have required property 'name'",
          params: {
            missingProperty: 'name',
          },
          schemaPath: '#/properties/body/required',
        },
        {
          dataPath: '.body.age',
          keyword: 'minimum',
          message: 'should be >= 0',
          params: {
            comparison: '>=',
            exclusive: false,
            limit: 0,
          },
          schemaPath: '#/properties/body/properties/age/minimum',
        },
        {
          dataPath: '.body.details',
          keyword: 'required',
          message: "should have required property 'location'",
          params: {
            missingProperty: 'location',
          },
          schemaPath: '#/properties/body/properties/details/required',
        },
        {
          dataPath: '.body.details.food',
          keyword: 'minLength',
          message: 'should NOT be shorter than 4 characters',
          params: {
            limit: 4,
          },
          schemaPath: '#/properties/body/properties/details/properties/food/minLength',
        },
      ],
    });
  });
});
