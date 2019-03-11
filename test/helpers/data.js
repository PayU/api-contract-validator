module.exports.headersObject = {
  valid: Object.freeze({
    'x-expires-after': 50,
    'x-rate-limit': 5,
    'x-elapsed-time': 130,
    'x-request-id': '12345',
  }),
  invalid: Object.freeze({
    'x-expires-after': 50,
    'x-rate-limit': 5,
    'x-request-id': '123',
  }),
};

module.exports.bodyObject = {
  valid: Object.freeze({
    description: 'Usually found in South-America',
    name: 'Llama',
    age: 4,
  }),
  invalid: Object.freeze({
    description: 'Oops',
    age: -1,
    details: {
      food: 'abc',
    },
  }),
};
