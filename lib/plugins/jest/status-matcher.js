const diff = require('jest-diff');
const matcherUtils = require('jest-matcher-utils');
const validators = require('../../validators');

module.exports = () => {
  buildMatcher('toBeSuccessful', 200);
  buildMatcher('toBeCreated', 201);
  buildMatcher('toBeBadRequest', 400);
  buildMatcher('toBeUnauthorized', 401);
  buildMatcher('toBeForbidden', 403);
  buildMatcher('toBeNotFound', 404);
  buildMatcher('toBeServerError', 500);
  buildMatcher('toBeServiceUnavailable', 503);
  buildMatcher('toBeGatewayTimeout', 504);
  buildMatcher('toHaveStatus');

  function buildMatcher(str, statusToTest) {
    expect.extend({
      [str]: (validatedResponse, customStatus) => {
        const expectedStatus = statusToTest || customStatus;

        const {
          predicate, expected, actual,
        } = validators.statusValidator(expectedStatus, validatedResponse);

        const pass = predicate;

        const message = pass
          ? () => `${matcherUtils.matcherHint(str)
          }\n\n`
            + `Expected: ${matcherUtils.printExpected(expected)}\n`
            + `Received: ${matcherUtils.printReceived(actual)}`
          : () => {
            const difference = diff(expected, actual, {
              expand: this.expand,
            });
            return (
              `${matcherUtils.matcherHint(str)
              }\n\n${
                difference && difference.includes('- Expect')
                  ? `Difference:\n\n${difference}`
                  : `Expected: ${matcherUtils.printExpected(expected)}\n`
                  + `Received: ${matcherUtils.printReceived(actual)}`}`
            );
          };

        return { actual, message, pass };
      },
    });
  }
};
