/* eslint-disable no-console */
const chalk = require('chalk');
const { get, set, chain } = require('lodash');

const schemaUtils = require('./schema-utils');
const buildTable = require('./coverage-table');

const coverage = {};
let schema;

module.exports.init = ({ reportCoverage, apiDefinitionsPath }) => {
  schema = schemaUtils.getSchema(apiDefinitionsPath);

  if (reportCoverage === true) {
    process.on('exit', () => {
      const parsedCoverage = getCoverage();
      printCoverage(parsedCoverage);
    });
  }
};

module.exports.setCoverage = ({ path, method, status }) => {
  const route = schemaUtils.pathMatcher(schema, path);

  set(coverage, `[${route}|${method}|${status}]`, true);
};


function getCoverage() {
  return chain(schema)
    .keys()
    .map(route => getUncoveredAPIs(route))
    .flatten()
    .filter(api => !!api)
    .value();
}

function getUncoveredAPIs(route) {
  return Object
    .keys(schema[route])
    .map((method) => {
      const statuses = Object
        .keys(schema[route][method].responses)
        .filter(status => !(get(coverage, `[${route}|${method}|${status}]`)))
        .toString();

      return statuses ? { route, method: method.toUpperCase(), statuses } : undefined;
    });
}

function printCoverage(data) {
  console.info(data);
  console.info(chalk.bold('* API definitions coverage report *'));
  if (data.length === 0) {
    console.info(chalk.green('All API definitions are covered\n'));
  } else {
    console.info(chalk.red('Uncovered API definitions found\n'));

    const table = buildTable(data);
    console.info(table);
  }
}
