const httpUtils = require('../../adapters/response-adapter');

module.exports = (Assertion) => {
  buildMatcher('successful', 200);
  buildMatcher('created', 201);
  buildMatcher('badRequest', 400);
  buildMatcher('unauthorized', 401);
  buildMatcher('rejected', 403);
  buildMatcher('notFound', 404);
  buildMatcher('serverError', 500);
  buildMatcher('serviceUnavailable', 503);
  buildMatcher('gatewayTimeout', 504);
  buildMatcher('status');

  function buildMatcher(str, statusToTest) {
    Assertion.addMethod(str, function statusCodeMatcher(customStatus) {
      const { _obj } = this;
      const { response } = httpUtils.parseResponse(_obj);

      const expectedStatus = statusToTest || customStatus;
      const { status, body } = response;
      this.assert(
        status === expectedStatus,
        `expected http status code ${status} to be ${expectedStatus}`,
        `expected http status code ${status} to not be ${expectedStatus}`,
        { status: expectedStatus },
        { status, body },
      );
    });
  }
};
