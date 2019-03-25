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

module.exports.validateCoverage = () => Object
  .keys(_schema)
  .map((route) => {
    const statusAndMethods = Object
      .keys(_schema[route])
      .map(method => getMethodsStatuses(_schema, route, method))
      .filter(({ statuses }) => statuses)
      .reduce(combineMethodsAndStatuses, {});

    if (statusAndMethods.methods && statusAndMethods.statuses) {
      return {
        route,
        // method: statusAndMethods,
        // statuses: statusAndMethods,
        method: statusAndMethods.methods.join('\n'),
        statuses: statusAndMethods.statuses.join('\n'),
      };
    }
    return undefined;
  })
  .filter(e => e);

function getMethodsStatuses(schema, route, method) {
  return {
    method,
    statuses: Object
      .keys(schema[route][method].responses)
      .filter(status => !(get(coverage, `[${route}|${method}|${status}]`)))
      .toString(),
  };
}

function combineMethodsAndStatuses(prev, { method, statuses }) {
  if (method && statuses) {
    return {
      methods: (prev.methods || []).concat(method.toUpperCase()),
      statuses: (prev.statuses || []).concat(statuses),
    };
  }
  return prev;
}

module.exports.printReport = (data) => {
  console.info(chalk.bold('* API definitions coverage report *'));
  if (data.length === 0) {
    console.info(chalk.green('All API definitions are covered\n'));
  } else {
    console.info(chalk.red('Uncovered API definitions found\n'));
    console.info(columnify(data, {
      preserveNewLines: true,
      columnSplitter: ' | ',
      minWidth: 10,
      headingTransform(title) {
        switch (title) {
          case 'statuses':
            return chalk.yellow.bold(`*${title.toUpperCase()}*`);
          case 'method':
            return chalk.green.bold(`*${title.toUpperCase()}*`);
          default:
            return chalk.cyan.underline.bold(`*${title.toUpperCase()}*`);
        }
      },
    }));
  }
};
