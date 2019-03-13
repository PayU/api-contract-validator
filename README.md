[![Build Status](https://travis-ci.org/Zooz/api-schema-validator.svg?branch=master)](https://travis-ci.org/Zooz/api-schema-validator)
[![Coverage Status](https://coveralls.io/repos/github/Zooz/api-schema-validator/badge.svg?branch=master)](https://coveralls.io/github/Zooz/api-schema-validator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Zooz/api-schema-validator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Zooz/api-schema-validator?targetFile=package.json)

# api-schema-validator
Plugin for validating API schemas from API documentation

## What it does?
Validating that your application responses are compatible with its API documentation should be never underestimated.
And testing your Restful application is standing to its API documentation was never easier. Just by pointing to your Swagger or OpenAPIv3 file and adding one line to your integration tests, this validator can tell you whether or not your application stands to its contract.

## How to use?
***Chai.js***
```js
const rp = require('request-promise');
const matchApiSchema = require('api-schema-validator');
const path = require('path');
const { expect, use } = require('chai');

const myApiDocPath = path.join(__dirname, 'myApp.yaml');

// add as chai plugin
use(matchApiSchema);

// we need to complete response object including the status code
const myApp = rp.defaults({
    baseUrl: 'http://www.localhost:8000',
    resolveWithFullResponse: true,
    simple: false,
    json: true
})

it('GET /pets/123', async () => {
    const response = await myApp.get('/pet/123');

    expect(response).to.be.successful().and.to.matchApiSchema(myApiDocPath);
})
```

## Supported request libraries
- request-promise
- axios
- supertest
- more to come

## Supported assertion libraries
- chai.js
- should.js
- more to come
The validation function itself is also exposed which allows this library to be agnostic