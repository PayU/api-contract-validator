const chaiPlugin = require('./plugins/chai');
const shouldPlugin = require('./plugins/should');
const validators = require('./validators');
const { validateCoverage, printReport } = require('./helpers/report');

module.exports = {
  chaiPlugin,
  shouldPlugin,
  validators,
};

process.on('exit', () => {
  const coverage = validateCoverage();
  printReport(coverage);
});
