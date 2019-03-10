const { get } = require('lodash');

module.exports.mapValuesByDataPath = (errors, response) => errors && errors.reduce((prev, error) => {
  const fullPath = getDataPath(error.dataPath);

  return fullPath.includes('.') // path is empty when error refers to missing property on the base object
    ? { ...prev, [fullPath]: get(response, fullPath) }
    : prev;
}, {});


module.exports.mapErrorsByDataPath = errors => errors && errors.reduce((prev, error) => {
  const fullPath = getDataPath(error.dataPath);
  const prevValue = prev[fullPath];
  return {
    ...prev,
    [fullPath]: prevValue ? [].concat(prevValue, error.message) : error.message,
  };
}, {});

function getDataPath(dataPath) {
  const fullDataPath = dataPath.replace(/^\./, '');

  if (!fullDataPath) {
    return 'body';
  }

  if (fullDataPath.startsWith('headers') || fullDataPath.startsWith('query') || fullDataPath.startsWith('query')) {
    return fullDataPath;
  }

  return `body.${fullDataPath}`;
}
