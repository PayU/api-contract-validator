const { chain } = require('lodash');
const apiSchemaBuilder = require('api-schema-builder');

const base64 = require('./base64');

module.exports.getSchema = (() => {
  const schemas = {};

  return (filePath, schemaBuilderOpts) => {
    const encodedFilePath = base64.encode(filePath);

    if (!schemas[encodedFilePath]) {
      schemas[encodedFilePath] = apiSchemaBuilder.buildSchemaSync(filePath, schemaBuilderOpts);
    }
    return schemas[encodedFilePath];
  };
})();

module.exports.getValidatorByPathMethodAndCode = (schema, request, response) => {
  const route = pathMatcher(schema, request.path);

  return chain(schema)
    .get(`${route}.${request.method}.responses.${response.status}`)
    .value();
};

module.exports.pathMatcher = pathMatcher;
function pathMatcher(routes, path) {
  return Object
    .keys(routes)
    .filter((route) => {
      const routeArr = route.split('/');
      const pathArr = path.split('/');

      if (routeArr.length !== pathArr.length) return false;

      return routeArr.every((seg, idx) => {
        if (seg === pathArr[idx]) return true;

        // if current path segment is param
        if (seg.startsWith(':') && pathArr[idx]) return true;

        return false;
      });
    })[0];
}
