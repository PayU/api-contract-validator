const { getCoverage, printCoverage } = require('./report');

module.exports = ({ reportCoverage, checkCoverage }) => {
  if (reportCoverage === true) {
    process.on('exit', () => {
      const coverage = getCoverage();
      printCoverage(coverage);
    });
  }

  if (checkCoverage === true) {
    process.on('exit', (code) => {
      const coverage = getCoverage();
      printCoverage(coverage);
      process.exit(coverage.length > 0 || code);
    });
  }
};
