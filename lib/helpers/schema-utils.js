const { chain } = require('lodash');

module.exports.extractPathSchema = function extractPathSchema(schema, request, response) {
  const path = pathMatcher(schema.properties.paths.properties, request.path);

  return chain(schema)
    .get('properties.paths')
    .get(`properties[${path}]`)
    .get(`properties[${request.method}]`)
    .get('properties.responses')
    .get(`properties[${response.statusCode}]`)
    .value();
};

function pathMatcher(schemaPaths, path) {
  return Object.keys(schemaPaths).reduce((prev, schemaPath) => {
    const matcher = schemaPath.replace(/\{[^}]+\}/, '[^/]+');
    if (path.match(`^${matcher}/?$`)) {
      return schemaPath;
    }
    return prev;
  }, undefined);
}
