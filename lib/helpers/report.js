/* eslint-disable no-console */
const chalk = require('chalk');
const columnify = require('columnify');
const { get, set } = require('lodash');

const schemaUtils = require('./schema-utils');

const coverage = {};
let _schema;

module.exports.markCovered = (schema, { path, method, status }) => {
  _schema = schema;
  const route = schemaUtils.pathMatcher(schema, path);

  set(coverage, `[${route}|${method}|${status}]`, true);
};

module.exports.getCoverage = () => Object
  .keys(_schema)
  .map(route => Object
    .keys(_schema[route])
    .map((method) => {
      const statuses = Object
        .keys(_schema[route][method].responses)
        .filter(status => !(get(coverage, `[${route}|${method}|${status}]`)))
        .toString();

      return statuses ? { route, method: method.toUpperCase(), statuses } : undefined;
    }))
  .filter(api => api[0] !== undefined);

module.exports.printCoverage = (data) => {
  console.info(chalk.bold('* API definitions coverage report *'));
  if (data.length === 0) {
    console.info(chalk.green('All API definitions are covered\n'));
  } else {
    console.info(chalk.red('Uncovered API definitions found\n'));

    const tableData = buildColumnifyData(data);

    console.info(columnify(tableData, {
      preserveNewLines: true,
      columnSplitter: ' | ',
      minWidth: 10,
      headingTransform,
    }));
  }
};

function buildColumnifyData(data) {
  return data
    .map(api => api.reduce(buildRows, {}))
    .map(({ route, method, statuses }) => ({
      route: route.join('\n'),
      method: method.join('\n'),
      statuses: statuses.join('\n'),
    }));
}

function buildRows(prev, { route, method, statuses }) {
  return {
    ...prev,
    route: prev.route ? prev.route.concat('') : [route],
    method: prev.route ? prev.method.concat(method) : [method],
    statuses: prev.route ? prev.statuses.concat(statuses) : [statuses],
  };
}

function headingTransform(title) {
  switch (title) {
    case 'statuses':
      return chalk.yellow.bold(`*${title.toUpperCase()}*`);
    case 'method':
      return chalk.green.bold(`*${title.toUpperCase()}*`);
    default:
      return chalk.cyan.underline.bold(`*${title.toUpperCase()}*`);
  }
}
