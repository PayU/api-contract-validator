const { IncomingMessage } = require('http');

const httpUtils = require('../adapters');

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
      const obj = this._obj;

      // validate that obj is IncomingMessage before parsing it
      new Assertion(obj).to.be.instanceof(IncomingMessage);
      const { response } = httpUtils.parseResponse(obj);

      const expectedCode = code || customCode;
      this.assert(
        response.statusCode === expectedCode,
        `expected http status code #{act} to be ${expectedCode}`,
        `expected http status code #{act} to not be ${expectedCode}`,
        expectedCode,
        response.statusCode,
      );
    });
  }
};
