const diff = require('jest-diff');
const matcherUtils = require('jest-matcher-utils');
const validators = require('../../validators');

module.exports = (options) => {
  const { apiDefinitionsPath } = options;

  expect.extend(
    {
      toMatchApiSchema: (validatedRequest) => {
        const {
          predicate, expected, actual,
        } = validators.schemaValidator(validatedRequest, { apiDefinitionsPath, ...options });

        const pass = predicate;

        const message = pass
          ? () => `${matcherUtils.matcherHint('toMatchApiSchema')
          }\n\n`
            + `Expected: ${matcherUtils.printExpected(expected)}\n`
            + `Received: ${matcherUtils.printReceived(actual)}`
          : () => {
            const difference = diff(expected, actual, {
              expand: this.expand,
            });
            return (
              `${matcherUtils.matcherHint('toMatchApiSchema')
              }\n\n${
                difference && difference.includes('- Expect')
                  ? `Difference:\n\n${difference}`
                  : `Expected: ${matcherUtils.printExpected(expected)}\n`
                + `Received: ${matcherUtils.printReceived(actual)}`}`
            );
          };

        return { actual, message, pass };
      },
    },
  );
};
