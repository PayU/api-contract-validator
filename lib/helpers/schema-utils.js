const fs = require('fs');
const { chain } = require('lodash');
const yaml = require('js-yaml');
const deref = require('json-schema-deref-sync');
const { buildValidations } = require('api-schema-builder');

module.exports.schemaMap = new Proxy({}, {
  get: (schemaMap, filePath) => {
    if (!schemaMap[filePath]) {
      const referenced = yaml.load(fs.readFileSync(filePath), 'utf8');
      const dereferenced = deref(referenced);

      schemaMap[filePath] = buildValidations( // eslint-disable-line no-param-reassign
        referenced,
        dereferenced,
        { formats },
      );
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

/* istanbul ignore next */
const formats = [
  {
    name: 'int64',
    pattern: /^\d{1,19}$/,
  },
  {
    name: 'int32',
    pattern: value => Number.isSafeInteger(value),
  },
  {
    name: 'float',
    pattern: value => Number.parseFloat(value) === value,
  },
  {
    name: 'double',
    pattern: /^-?\d+(\.\d{1,})?/,
  },
];
