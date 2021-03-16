# Master

2.2.4 - 15 March, 2021

#### Fixes
-  Prioritize exact path segment matching


# 2.2.3 - 23 January 2021
 - a fixed bug: when response is with additionalProperties false,
   The error was not shown or was not fit to specific field.

# 2.2.2 - 13 December, 2020
 - update "api-schema-builder" package to latest 

# 2.2.1 - 9 December, 2020
 - Update types to reflect the support of multiple definitions files paths

# 2.2.0 - 3 December, 2020

### New features

- Support multiple yaml documents #52
- Support using nullable

# 2.1.0 - 15 May, 2020

### New features

- Support response format from fastify inject() #44

# 2.0.0 - 5 May, 2020

### Breaking changes

- Validate loaded OpenAPI specification (throws an error if it's not a valid OpenAPI 3.0 document) #42
- If your OpenAPI 3.x specification includes servers definition, some of the endpoints that weren't being matched for validation in the past can start getting validated (if any of servers + path combination matches) #42
