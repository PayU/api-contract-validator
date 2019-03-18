[![Build Status](https://travis-ci.org/Zooz/api-schema-validator.svg?branch=master)](https://travis-ci.org/Zooz/api-schema-validator)
[![Coverage Status](https://coveralls.io/repos/github/Zooz/api-schema-validator/badge.svg?branch=master)](https://coveralls.io/github/Zooz/api-schema-validator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Zooz/api-schema-validator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Zooz/api-schema-validator?targetFile=package.json)

# api-schema-validator
Plugin for validating API schemas from API documentation

## What it does?
Validating that your application responses are compatible with its 
API documentation should be never underestimated.

Testing your Restful application is standing to its API documentation was never easier. 
Just by pointing to your Swagger 2.0 or OpenAPIv 3.0 file and adding one line to your integration test,
 this validator can tell you whether or not your application stands to its contract.

## How things are done?
api-schema-validator prepares the json-schema according to the given API documentation file 
and whenever matchApiSchema is called, it automatically extracts the method, path and status code 
from the response object. Using the this data it's applying the correct validation on the 
response object, validating both the response headers and body.

## How to use?
###installation###
```bash
> npm i --save-dev api-schema-validator
```

***Chai.js***
```js
const rp = require('request-promise');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const { expect, use } = require('chai');

// add as chai plugin
const apiDefinitionsPath = path.join(__dirname, 'myApp.yaml');
use(matchApiSchema({ apiDefinitionsPath }));

// we need to complete response object including the status code
const myApp = rp.defaults({
    baseUrl: 'http://www.localhost:8000',
    resolveWithFullResponse: true,
    json: true
})

it('GET /pets/123', async () => {
    // testing 200
    const response = await myApp.get('/pet/123');
    expect(response).to.be.successful().and.to.matchApiSchema();

    // testing using request-promise `simple: false` flag
    const response = await myApp.get('/pet/123', { simple: false });
    expect(response).to.be.a.badRequest().and.to.matchApiSchema();

    // testing non-2xx status using try-catch
    try {
        const response = await myApp.get('/pet/123');
    } catch (error) {
        expect(error.response).to.be.a.badRequest().and.to.matchApiSchema();
    }
})
```

## Supported request libraries
- supertest
- request-promise*
- axios
- more to come

*\* When using request-promise `resolveWithFullResponse:true` must be added to the request options, in order to properly extract the request details*

## Supported assertion libraries
- chai.js
- should.js
- more to come

The validation function itself is also exposed which allows this library to be agnostic


***Should.js***
```js
const matchApiSchema = require('api-contract-validator').shouldPlugin;

// add as should plugin
matchApiSchema(should.Assertion, { apiDefinitionsPath });

it('GET /pets/123', async () => {
    const response = await myApp.get('/pet/123');

    should(response).be.successful().and.matchApiSchema();
})
```