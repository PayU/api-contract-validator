const httpUtils = require('../adapters/response-adapter');

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

  function buildMatcher(str, code) {
    Assertion.addMethod(str, function statusCodeMatcher(customCode) {
      const { _obj } = this;
      const { response } = httpUtils.parseResponse(_obj);

      const expectedCode = code || customCode;
      const { statusCode, body } = response;
      this.assert(
        statusCode === expectedCode,
        `expected http status code ${statusCode} to be ${expectedCode}`,
        `expected http status code ${statusCode} to not be ${expectedCode}`,
        { statusCode: expectedCode },
        { statusCode, body },
      );
    });
  }
};
