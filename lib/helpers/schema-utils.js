const sp = require('synchronized-promise');
const { chain } = require('lodash');

const apiSchemaBuilder = require('../../../api-schema-builder');

const buildSchema = sp(apiSchemaBuilder.buildSchema);

module.exports.schemaMap = new Proxy({}, {
  get: (schemaMap, filePath) => {
    if (!schemaMap[filePath]) {
      schemaMap[filePath] = buildSchema(filePath); // eslint-disable-line no-param-reassign
    }
    return schemaMap[filePath];
  },
});

module.exports.getValidatorByPathMethodAndCode = (schema, request, response) => {
  const path = pathMatcher(schema, request.path);

  return chain(schema)
    .get(`${path}.${request.method}.responses.${response.status}`)
    .value();
};

function pathMatcher(schema, path) {
  return Object.keys(schema).reduce((prev, schemaPath) => {
    const matcher = schemaPath
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\//g, '.');
    const re = new RegExp(`^${matcher}$`, 'i');

    if (re.exec(path)) {
      return schemaPath;
    }

    return prev;
  }, undefined);
}
