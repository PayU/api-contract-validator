const validators = require('../../validators');

module.exports = (options) => {
  const { apiDefinitionsPath } = options;

  expect.extend(
    {
      toMatchApiSchema: (validatedRequest) => {
        const {
          predicate, expected, actual, matchMsg,
        } = validators.schemaValidator(validatedRequest, { apiDefinitionsPath, ...options });

        const message = predicate ? undefined : () => `${matchMsg}: expected ${JSON.stringify(expected)}, but found ${JSON.stringify(actual)}`;
        return {
          message,
          pass: predicate,
        };
      },
    },
  );
};
