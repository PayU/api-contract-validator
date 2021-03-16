const { expect } = require('chai');

const { pathMatcher } = require('../lib/helpers/schema-utils');


describe('path matcher test', () => {
  it('basic - when schema has only one path /api/v1/sar/reports/:requestId/:otherId '
      + 'and request is /api/v1/sar/reports/bulk/7127836128736 should match', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { post: 'validator' },
    };
    const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
    expect(routeResult).equals('/api/v1/sar/reports/:requestId/:otherId');
  });
  it('when there is no match method request - should return undefined', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { get: 'validator' },
    };
    const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
    expect(routeResult).equals(undefined);
  });
  describe('when routes includes both /api/v1/sar/reports/:requestId vs /api/v1/sar/reports/bulk', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId': { post: 'validator-requestId' },
      '/api/v1/sar/reports/bulk': { post: 'validator-requestId' },
    };
    it('and request url is /api/v1/sar/reports/bulk - should take the exact match /api/v1/sar/reports/bulk', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/bulk');
    });
    it('and request url is /api/v1/sar/reports/7127836128736 - should returns /api/v1/sar/reports/:requestId route', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/:requestId');
    });
  });

  describe('when routes includes both /api/v1/sar/reports/:requestId/:otherId vs /api/v1/sar/reports/bulk/:other', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { post: 'validator-requestId' },
      '/api/v1/sar/reports/bulk/:other': { post: 'validator-requestId' },
    };

    it('and request url is /api/v1/sar/reports/bulk/7127836128736 - should take the match /api/v1/sar/reports/bulk/:other', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/bulk/:other');
    });
    it('and request url is /api/v1/sar/reports/7127836128736/7127836128736 - should returns /api/v1/sar/reports/:requestId/:otherId route', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/7127836128736/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/:requestId/:otherId');
    });
  });

  describe('when routes includes both /i/am/:here vs /i/:am/:here', () => {
    const routes = {
      '/i/am/:here': { post: 'validator-requestId' },
      '/i/:am/:here': { post: 'validator-requestId' },
    };

    it('and request url is /i/am/blblb - should match /i/am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/am/blblb', 'post');
      expect(routeResult).equals('/i/am/:here');
    });
    it('and request url is /i/bbb/blblb - should match /i/:am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/bbb/blbl', 'post');
      expect(routeResult).equals('/i/:am/:here');
    });
  });
  describe('when routes includes both /i/:am/:here vs /i/:am/here', () => {
    const routes = {
      '/i/:am/:here': { post: 'validator-requestId' },
      '/i/:am/here': { post: 'validator-requestId' },
    };
    it('and request url is /i/am/blblb - should match /i/:am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/am/blblb', 'post');
      expect(routeResult).equals('/i/:am/:here');
    });
    it('and request url is /i/bbb/here - should match /i/:am/here', () => {
      const routeResult = pathMatcher(routes, '/i/bbb/here', 'post');
      expect(routeResult).equals('/i/:am/here');
    });
  });
  describe('when routes includes both /aaaa/:bbbb vs /:aaaa/bbbb', () => {
    const routes = {
      '/aaaa/:bbbb': { post: 'validator-requestId' },
      '/:aaaa/bbbb': { post: 'validator-requestId' },
    };
    it('and request url is /aaaa/bbbb - should match /aaaa/:bbbb', () => {
      const routeResult = pathMatcher(routes, '/aaaa/bbbb', 'post');
      expect(routeResult).equals('/aaaa/:bbbb');
    });
  });
});
