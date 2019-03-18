[![Build Status](https://travis-ci.org/Zooz/api-contract-validator.svg?branch=master)](https://travis-ci.org/Zooz/api-contract-validator)
[![Coverage Status](https://coveralls.io/repos/github/Zooz/api-contract-validator/badge.svg?branch=master)](https://coveralls.io/github/Zooz/api-contract-validator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Zooz/api-contract-validator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Zooz/api-contract-validator?targetFile=package.json)

# api-contract-validator
This is a plugin for validating API response schemas against Swagger/OpenAPI definition. 

Using the plugin is easy. Simply point the plugin to your Swagger 2.0 or OpenAPIv 3.0 file and add one line to your integration test to validate that your application adheres to its design contract. 

Testing your Restful application is standing to its API documentation was never easier. 
Just by pointing to your Swagger 2.0 or OpenAPIv 3.0 file and adding one line to your integration test, 
this validator can tell you whether or not your application stands to its contract.

## How does it work?
The api-contract-validator transforms your API definition into a json-schema based on the provided API documentation file. Then whenever the `matchApiSchema` assertion is called, it automatically extracts the method, path and status code from the response object returned by the API request that you invoked and validates the response object. Both the response headers and body are validated.

## How to use?
***Installation***
```bash
> npm i --save-dev api-contract-validator
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
    expect(response).to.have.status(200).and.to.matchApiSchema();

    // testing using request-promise `simple: false` flag
    const response = await myApp.get('/pet/123', { simple: false });
    expect(response).to.have.status(400).and.to.matchApiSchema();

    // testing non-2xx status using try-catch
    try {
        const response = await myApp.get('/pet/123');
    } catch (error) {
        expect(error.response).to.have.status(400).and.to.matchApiSchema();
    }
})
```

***Should.js***
```js
const matchApiSchema = require('api-contract-validator').shouldPlugin;

// add as should plugin
matchApiSchema(should.Assertion, { apiDefinitionsPath });

it('GET /pets/123', async () => {
    const response = await myApp.get('/pet/123');

    should(response).have.status(200).and.matchApiSchema();
})
```

## Supported request libraries
- supertest
- axios
- request-promise*
- more to come

*\* When using request-promise `resolveWithFullResponse:true` must be added to the request options, in order to properly extract the request details*

## Supported assertion libraries
- chai.js
- should.js
- more to come

The validation function itself is also exposed, allowing this plugin to be assertion-library agnostic.
