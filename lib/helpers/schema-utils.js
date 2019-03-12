const fs = require('fs');
const { chain, get } = require('lodash');

module.exports.schemaMap = new Proxy({}, {
  get: (schemaMap, path) => {
    if (!schemaMap[path]) {
      schemaMap[path] = JSON.parse(fs.readFileSync(path, 'utf8')); // eslint-disable-line no-param-reassign
    }
    return schemaMap[path];
  },
});

module.exports.extractPathSchema = (schema, request, response) => {
  const pathSchema = getSchemaByPathMethodAndCode(schema, request, response);

  if (pathSchema) {
    return {
      type: 'object',
      required: ['headers', 'body'],
      properties: {
        // headers: chain(pathSchema)
        //   .get('properties.headers')
        //   .value(),
        body: chain(pathSchema)
          .get('properties.schema')
          .get('properties.properties')
          .value(),
      },
    };
  }

  return undefined;
};

function getSchemaByPathMethodAndCode(schema, request, response) {
  const path = pathMatcher(schema, request.path);

  return chain(schema)
    .get('properties.paths')
    .get(`properties[${path}]`)
    .get(`properties[${request.method}]`)
    .get('properties.responses')
    .get(`properties[${response.status}]`)
    .value();
}

function pathMatcher(schema, path) {
  const schemaPaths = get(schema, 'properties.paths.properties');

  if (schemaPaths) {
    return Object.keys(schemaPaths).reduce((prev, schemaPath) => {
      const matcher = schemaPath.replace(/\{[^}]+\}/, '[^/]+');
      if (path.match(`^${matcher}/?$`)) {
        return schemaPath;
      }
      return prev;
    }, undefined);
  }

  return undefined;
}
