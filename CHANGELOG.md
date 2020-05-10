# Master

### New features

- Support response format from fastify inject() #44

# 2.0.0 - 5 May, 2020

### Breaking changes

- Validate loaded OpenAPI specification (throws an error if it's not a valid OpenAPI 3.0 document) #42
- If your OpenAPI 3.x specification includes servers definition, some of the endpoints that weren't being matched for validation in the past can start getting validated (if any of servers + path combination matches) #42
