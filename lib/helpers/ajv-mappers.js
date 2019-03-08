const get = require('lodash.get');

module.exports.mapValuesByDataPath = (errors, obj) => errors && errors.reduce((prev, error) => {
  const path = error.dataPath.replace('.', '');
  const fullPath = `body${error.dataPath}`;
  return path // path is empty when error refers to missing property on the base object
    ? { ...prev, [fullPath]: get(obj.body, path) }
    : prev;
}, {});


module.exports.mapErrorsByDataPath = errors => errors && errors.reduce((prev, error) => {
  const fullPath = `body${error.dataPath}`;
  const prevValue = prev[fullPath];
  return {
    ...prev,
    [fullPath]: prevValue ? [].concat(prevValue, error.message) : error.message,
  };
}, {});
