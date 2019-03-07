const get = require('lodash.get');

module.exports.getValuesByDataPath = (errors, obj) => errors.reduce((prev, error) => {
  const path = error.dataPath.replace('.', '');
  const fullPath = `body${error.dataPath}`;
  return path // path is empty where error refers to missing property on the base object
    ? { ...prev, [fullPath]: get(obj.body, path) }
    : prev;
}, {});

module.exports.getErrorsByDataPath = errors => errors.reduce((prev, error) => {
  const dp = `body${error.dataPath}`;
  return {
    ...prev,
    [dp]: error.message,
  };
}, {});
