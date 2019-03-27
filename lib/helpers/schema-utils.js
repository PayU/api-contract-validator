const fs = require('fs');
const { chain } = require('lodash');
const yaml = require('js-yaml');
const deref = require('json-schema-deref-sync');
const { buildValidations } = require('api-schema-builder');

const base64 = require('./base64');

module.exports.getSchema = (() => {
  const schemas = {};

  return (filePath) => {
    const encodedFilePath = base64.encode(filePath);

    if (!schemas[encodedFilePath]) {
      const referenced = yaml.load(fs.readFileSync(filePath), 'utf8');
      const dereferenced = deref(referenced);

      schemas[encodedFilePath] = buildValidations(referenced, dereferenced, { formats });
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
function pathMatcher(schema, path) {
  return Object.keys(schema).reduce((prev, route) => {
    const matcher = route
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\//g, '.');
    const re = new RegExp(`^${matcher}$`, 'i');

    if (re.exec(path)) {
      return route;
    }

    return prev;
  }, undefined);
}


/* istanbul ignore next */
const formats = [
  {
    name: 'int64',
    pattern: {
      validate: /^\d{1,19}$/,
      type: 'number',
    },
  },
  {
    name: 'int32',
    pattern: {
      validate: value => Number.isSafeInteger(value),
      type: 'number',
    },
  },
  {
    name: 'float',
    pattern: {
      validate: value => Number.parseFloat(value) === value,
      type: 'number',
    },
  },
  {
    name: 'double',
    pattern: {
      validate: /^-?\d+(\.\d{1,})?/,
      type: 'number',
    },
  },
];
