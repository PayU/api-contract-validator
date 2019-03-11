/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiLike = require('chai-like');

const { axios, request, supertest } = require('./helpers/response-generator');
const { headersObject, bodyObject } = require('./helpers/data');
const { parseResponse } = require('../lib/adapters/response-adapter');

chai.use(chaiLike);
const { expect } = chai;

describe('When calling responseAdapter', () => {
  it('Should map fields correctly from request-promise response', async () => {
    const rpResponse = await request({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    expect(parseResponse(rpResponse)).to.be.like(expectedResponse);
  });

  it('Should map fields correctly from axios response', async () => {
    const axiosResponse = await axios({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    expect(parseResponse(axiosResponse)).to.be.like(expectedResponse);
  });

  it('Should map fields correctly from supertest response', async () => {
    const stResponse = await supertest({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    expect(parseResponse(stResponse)).to.be.like(expectedResponse);
  });

  it('Should return undefined in case of an unknown argument', async () => {
    expect(parseResponse('')).to.to.be.undefined;
    expect(parseResponse({})).to.to.be.undefined;
    expect(parseResponse(undefined)).to.to.be.undefined;
    expect(parseResponse(null)).to.to.be.undefined;
    expect(parseResponse([])).to.to.be.undefined;
  });
});

const expectedResponse = {
  request: {
    method: 'get',
    path: '/pet/123',
  },
  response: {
    status: 200,
    body: bodyObject.valid,
  },
};
