/* eslint-disable no-console */
const chalk = require('chalk');
const { get, set } = require('lodash');

const schemaUtils = require('./schema-utils');
const buildTable = require('./coverage-table');
const { flatten } = require('./array-utils');


module.exports = ({ reportCoverage, apiDefinitionsPath }) => {
  const coverage = {};
  const schema = schemaUtils.getSchema(apiDefinitionsPath);

  if (reportCoverage === true) {
    process.on('exit', () => {
      const cov = getCoverage(schema, coverage);
      printCoverage(cov);
    });

    return ({ path, method, status }) => {
      const route = schemaUtils.pathMatcher(schema, path);

      set(coverage, `[${route}|${method}|${status}]`, true);
    };
  }

  return () => { };
};

function getCoverage(schema, coverage) {
  return Object
    .keys(schema)
    .map(route => Object
      .keys(schema[route])
      .map((method) => {
        const statuses = Object
          .keys(schema[route][method].responses)
          .filter(status => !(get(coverage, `[${route}|${method}|${status}]`)))
          .toString();

        return statuses ? { route, method: method.toUpperCase(), statuses } : undefined;
      }))
    .filter(api => !!api[0])
    .reduce(flatten, []);
}

function printCoverage(data) {
  console.info(chalk.bold('* API definitions coverage report *'));
  if (data.length === 0) {
    console.info(chalk.green('All API definitions are covered\n'));
  } else {
    console.info(chalk.red('Uncovered API definitions found\n'));

    const table = buildTable(data);
    console.info(table);
  }
}
