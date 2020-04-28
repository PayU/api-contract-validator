const diff = require('jest-diff').default;
const matcherUtils = require('jest-matcher-utils');
const validators = require('../../validators');

module.exports = (options) => {
  expect.extend(
    {
      toMatchApiSchema: (validatedRequest, apiDefinitionsPath) => {
        const {
          predicate, expected, actual,
        } = validators.schemaValidator(
          validatedRequest,
          { ...options, apiDefinitionsPath: apiDefinitionsPath || options.apiDefinitionsPath },
        );

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
