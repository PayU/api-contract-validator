module.exports.validBody = () => ({
  description: 'Usually found in South-America',
  name: 'Llama',
  age: 4,
});

module.exports.invalidBody = () => ({
  description: 'Oops',
  age: -1,
});
