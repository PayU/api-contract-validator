/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const chaiLike = require('chai-like');

const { axios, request, supertest } = require('./helpers/response-generator');
const responses = require('./data/responses');
const { parseResponse } = require('../lib/helpers/response-adapter');

use(chaiLike);

describe('responseAdapter', () => {
  it('request-promise response', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('axios response', async () => {
    const response = await axios({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('supertest response', async () => {
    const response = await supertest({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('request-promise non-2xx response', async () => {
    try {
      await request({
        status: 400,
        body: responses.body.valid.value,
        headers: responses.headers.valid.value,
      });
    } catch (error) {
      expect(parseResponse(error.response)).to.be.like(expected400Response);
    }
  });

  it('axios non-2xx response', async () => {
    try {
      await axios({
        status: 400,
        body: responses.body.valid.value,
        headers: responses.headers.valid.value,
      });
    } catch (error) {
      expect(parseResponse(error.response)).to.be.like(expected400Response);
    }
  });

  it('axios request with query string', async () => {
    const response = await axios({
      status: 200,
      uri: '/v2/pet/123?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('request-promise request with query string', async () => {
    const response = await request({
      status: 200,
      uri: '/v2/pet/123?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('supertest request with query string', async () => {
    const response = await supertest({
      status: 200,
      uri: '/v2/pet/123?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('request-promise request with extra /', async () => {
    const response = await request({
      status: 200,
      uri: '/v2/pet/123//?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('axios request with extra /', async () => {
    const response = await axios({
      status: 200,
      uri: '/v2/pet/123/?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('supertest request with extra /', async () => {
    const response = await supertest({
      status: 200,
      uri: '/v2/pet/123/?s=value',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(parseResponse(response)).to.be.like(expectedResponse);
  });

  it('simple object', async () => {
    expect(parseResponse({
      method: 'get',
      status: 200,
      path: '/v2/pet/123',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    })).to.be.like(expectedResponse);
    expect(parseResponse({
      method: 'get',
      statusCode: 200,
      path: '/v2/pet/123',
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    })).to.be.like(expectedResponse);
  });

  it('invalid object', async () => {
    expect(parseResponse(undefined)).to.to.be.undefined;
    expect(parseResponse(null)).to.to.be.undefined;
  });
});

const expectedResponse = Object.freeze({
  request: {
    method: 'get',
    path: '/v2/pet/123',
  },
  response: {
    status: 200,
    body: responses.body.valid.value,
    headers: responses.headers.valid.value,
  },
});

const expected400Response = Object.freeze({
  request: {
    method: 'get',
    path: '/v2/pet/123',
  },
  response: {
    status: 400,
    body: responses.body.valid.value,
  },
});
