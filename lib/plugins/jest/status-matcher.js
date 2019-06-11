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
          predicate, expected, actual, matchMsg,
        } = validators.statusValidator(expectedStatus, validatedResponse);


        const message = predicate ? undefined : () => `${matchMsg}: expected ${JSON.stringify(expected)}, but found ${JSON.stringify(actual)}`;
        return {
          message,
          pass: predicate,
        };
      },
    });
  }
};
