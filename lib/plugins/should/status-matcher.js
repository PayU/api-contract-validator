const validators = require('../../validators');

module.exports = (Assertion) => {
  buildMatcher('successful', 200);
  buildMatcher('created', 201);
  buildMatcher('badRequest', 400);
  buildMatcher('unauthorized', 401);
  buildMatcher('forbidden', 403);
  buildMatcher('notFound', 404);
  buildMatcher('serverError', 500);
  buildMatcher('serviceUnavailable', 503);
  buildMatcher('gatewayTimeout', 504);
  buildMatcher('status');

  function buildMatcher(str, statusToTest) {
    Assertion.add(str, function statusCodeMatcher(customStatus) {
      const expectedStatus = statusToTest || customStatus;
      const {
        predicate, actual, expected, matchMsg,
      } = validators.statusValidator(expectedStatus, this.obj);

      this.params = {
        message: matchMsg,
        expected,
        actual,
      };

      predicate.should.be.true();
    });
  }
};
