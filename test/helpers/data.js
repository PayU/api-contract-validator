module.exports.headersObject = {
  valid: Object.freeze({
    'x-expires-after': 50,
    'x-rate-limit': 5,
  }),
  invalid: Object.freeze({
    'x-expires-after': 50,
    'x-rate-limit': 5,
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
  }),
};
