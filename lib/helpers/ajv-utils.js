const Ajv = require('ajv');
const { get, set } = require('lodash');

const AJV_CONFIG = {
  allErrors: true,
  coerceTypes: 'array',
};

module.exports.validate = (schema, response) => {
  const ajv = new Ajv(AJV_CONFIG);

  return {
    predicate: ajv.validate(schema, response),
    actual: mapValuesByDataPath(ajv.errors, response),
    expected: mapErrorsByDataPath(ajv.errors),
  };
};

function mapValuesByDataPath(errors, response) {
  return errors && errors.reduce((prev, error) => {
    const { root, fullPath } = getDataPath(error.dataPath);
    const value = get(response, fullPath);

    if (root !== fullPath || root.match(/[[.]/)) {
      return set({ ...prev }, fullPath, value);
    }
    return { ...prev };
  }, {});
}

function mapErrorsByDataPath(errors) {
  return errors && errors.reduce((prev, error) => {
    const { missingProperty } = error.params;
    const { fullPath } = getDataPath(error.dataPath);

    if (missingProperty) {
      const message = error.message.replace(/ '.*$/, '');
      return set({ ...prev }, `${fullPath}.${missingProperty}`, message);
    }
    return set({ ...prev }, fullPath, error.message);
  }, {});
}

function getDataPath(dataPath) {
  const fullPath = dataPath
    .replace(/^\./, '')
    .replace(/\\/, '');

  const [root] = fullPath.split('.');
  return { root, fullPath };
}
