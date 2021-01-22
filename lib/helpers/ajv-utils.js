const get = require('lodash.get');
const set = require('lodash.set');

module.exports.parseErrors = (errors, response) => ({
  actual: mapValuesByDataPath(errors, response),
  expected: mapErrorsByDataPath(errors),
});

function mapValuesByDataPath(errors, response) {
  return errors && errors.reduce((prev, error) => {
    if (!error.dataPath) {
      return prev;
    }

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
    if (!error.params) {
      return prev;
    }

    const { missingProperty, additionalProperty } = error.params;
    const { fullPath } = getDataPath(error.dataPath);

    if (missingProperty) {
      const message = error.message.replace(/ '.*$/, '');
      return set({ ...prev }, `${fullPath}.${missingProperty}`, message);
    }
    if (additionalProperty) {
      const { message } = error;
      return set({ ...prev }, `${fullPath}.${additionalProperty}`, message);
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
