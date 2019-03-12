const { messages } = require('../../helpers/common');
const responseAdapter = require('../../adapters/response-adapter');

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

      const parsedResponse = responseAdapter.parseResponse(_obj);
      if (!(parsedResponse instanceof Object)) {
        throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
      }

      const { response } = parsedResponse;
      const { status, body } = response;
      if (!status) {
        throw new Error(messages.EXPECTED_REQUEST_AXIOS_SUPERTEST_OBJ);
      }

      const expectedStatus = statusToTest || customStatus;
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
