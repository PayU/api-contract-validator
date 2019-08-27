const chalk = require('chalk');
const columnify = require('columnify');

module.exports = (data) => columnify(data, {
  columnSplitter: ' | ',
  minWidth: 10,
  headingTransform(title) {
    switch (title) {
      case 'statuses':
        return chalk.yellow.underline.bold(`*${title.toUpperCase()}*`);
      case 'method':
        return chalk.green.underline.bold(`*${title.toUpperCase()}*`);
      default:
        return chalk.cyan.underline.bold(`*${title.toUpperCase()}*`);
    }
  },
});
