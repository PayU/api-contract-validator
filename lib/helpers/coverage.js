/* eslint-disable no-console */
const chalk = require('chalk');
const { get, set, chain } = require('lodash');

const schemaUtils = require('./schema-utils');
const buildTable = require('./coverage-table');

let coverage;
let schema;

module.exports.init = ({ reportCoverage, apiDefinitionsPath, buildSchemaOptions }) => {
  coverage = {};
  const buildSchemaOptionsOverride = buildSchemaOptions || {};
  schema = schemaUtils.getSchema(apiDefinitionsPath, buildSchemaOptionsOverride);

  if (reportCoverage === true) {
    process.on('beforeExit', () => {
      const parsedCoverage = getReport();
      printReport(parsedCoverage);
    });
  }
};

module.exports.setCoverage = ({ path, method, status }) => {
  const route = schemaUtils.pathMatcher(schema, path);

  set(coverage, `[${route}|${method}|${status}]`, true);
};

function getReport() {
  return chain(schema)
    .keys()
    .map(route => getUncoveredDefinitions(route))
    .flatten()
    .filter(api => !!api)
    .value();
}
module.exports.getReport = getReport;

function getUncoveredDefinitions(route) {
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

function printReport(report) {
  console.info(chalk.bold('* API definitions coverage report *'));
  if (report.length === 0) {
    console.info(chalk.green('\nAll API definitions are covered\n'));
  } else {
    console.info(chalk.red('\nUncovered API definitions found'));

    const table = buildTable(report);
    console.info(table);
  }
}
