const validBody = Object.freeze({
  value: {
    description: 'Usually found in South-America',
    name: 'Llama',
    age: 4,
  },
});

const validHeaders = Object.freeze({
  value: {
    'x-expires-after': '2019-03-13T10:07:38.376Z',
    'x-rate-limit': '5',
    'x-elapsed-time': '130',
    'x-request-id': '12345',
  },
});

const invalidBody = Object.freeze({
  value: {
    description: 'Oops',
    age: -1,
    details: {
      food: 'abc',
    },
  },
  errors: [
    {
      dataPath: '.body',
      keyword: 'required',
      message: "should have required property 'name'",
      params: {
        missingProperty: 'name',
      },
      schemaPath: '#/body/required',
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
      schemaPath: '#/body/properties/age/minimum',
    },
  ],
  actual: {
    body: {
      age: -1,
    },
  },
  expected: {
    body: {
      age: 'should be >= 0',
      name: 'should have required property',
    },
  },
});

const invalidHeaders = Object.freeze({
  value: {
    'x-expires-after': 'abc',
    'x-rate-limit': -5,
    'x-request-id': '123',
  },
  actual: {
    headers: {
      'x-expires-after': 'abc',
      'x-rate-limit': -5,
    },
  },
  expected: {
    headers: {
      'x-expires-after': 'should match format "date-time"',
      'x-rate-limit': 'should be >= 0',
    },
  },
  errors: [
    {
      dataPath: ".headers['x-rate-limit']",
      keyword: 'minimum',
      message: 'should be >= 0',
      params: {
        comparison: '>=',
        exclusive: false,
        limit: 0,
      },
      schemaPath: '#/headers/properties/x-rate-limit/minimum',
    },
    {
      dataPath: ".headers['x-expires-after']",
      keyword: 'format',
      message: 'should match format "date-time"',
      params: {
        format: 'date-time',
      },
      schemaPath: '#/headers/properties/x-expires-after/format',
    },
  ],
});

module.exports = Object.freeze({
  body: {
    valid: validBody,
    invalid: invalidBody,
  },
  headers: {
    valid: validHeaders,
    invalid: invalidHeaders,
  },
});
