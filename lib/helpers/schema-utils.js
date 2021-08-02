const get = require('lodash.get');
const apiSchemaBuilder = require('api-schema-builder');
const { messages } = require('./common');
const base64 = require('./base64');

const getSchema = (() => {
  const schemas = {};

  return (filePath, schemaBuilderOpts) => {
    const encodedFilePath = base64.encode(filePath);

    if (!schemas[encodedFilePath]) {
      schemas[encodedFilePath] = apiSchemaBuilder.buildSchemaSync(filePath, schemaBuilderOpts);
    }
    return schemas[encodedFilePath];
  };
})();

module.exports.getSchemaByFilesPath = (apiDefinitionsPath, buildSchemaOptions) => {
  const filesPaths = Array.isArray(apiDefinitionsPath) ? apiDefinitionsPath : [apiDefinitionsPath];
  const schemas = filesPaths.map((path) => getSchema(path, buildSchemaOptions));
  // eslint-disable-next-line array-callback-return,consistent-return
  const schema = schemas.reduce((acc, cur) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(cur)) {
      if (acc[key]) {
        throw new Error(`${messages.DUPLICATE_API_DEFINITION}: ${key}`);
      }
      acc[key] = cur[key];
    }
    return acc;
  }, {});
  return schema;
};

module.exports.getValidatorByPathMethodAndCode = (schema, request, response) => {
  const route = pathMatcher(schema, request.path, request.method);
  return get(schema, `${route}.${request.method}.responses.${response.status}`);
};

module.exports.pathMatcher = pathMatcher;
function pathMatcher(routes, path, method) {
  return Object
    .keys(routes)
    .sort((currentRoute, nextRoute) => {
      const firstResult = calculateRouteScore(currentRoute);
      const secondResult = calculateRouteScore(nextRoute);

      return firstResult - secondResult;
    })
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
    }).filter(((route) => routes[route][String(method).toLowerCase()]))[0];
}

function calculateRouteScore(route) {
  return route
  // split to path segments
    .split('/')
  // mark path params locations
    .map((pathSegment) => pathSegment.includes(':'))
  // give weight to each path segment according to its location
    .map((isPathParam, i, pathSegments) => isPathParam * (10 ** pathSegments.length - i))
    .reduce((sum, seg) => sum + seg, 0); // summarize the path score
}
