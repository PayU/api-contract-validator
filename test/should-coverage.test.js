const path = require('path');
const sinon = require('sinon');
const chalk = require('chalk');
const should = require('should');

const apiSchema = require('../lib/index');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');

describe('Should.js plugin coverage', () => {
  const sandbox = sinon.createSandbox();

  before(() => {
    this.spy = sandbox.spy(console, 'info');
  });

  after(() => {
    sandbox.restore();
  });

  afterEach(() => {
    process.removeAllListeners('beforeExit');
    sandbox.resetHistory();
  });

  it('reportCoverage: true', async () => {
    apiSchema.shouldPlugin(should, { apiDefinitionsPath, reportCoverage: true });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.callCount(this.spy, 3);
    sinon.assert.calledWith(this.spy.firstCall, chalk.bold('* API definitions coverage report *'));
    sinon.assert.calledWith(this.spy.secondCall, chalk.red('\nUncovered API definitions found'));
    sinon.assert.calledWith(this.spy.thirdCall, `${chalk.cyan.underline.bold('*ROUTE*')}        | ${chalk.green.underline.bold('*METHOD*')}   | ${chalk.yellow.underline.bold('*STATUSES*')} \n/v2/pet        | POST       | 405        \n/v2/pet        | PUT        | 400,404,405\n/v2/pet/:petId | GET        | 200        \n/v2/pet/:petId | POST       | 405        \n/v2/pet/:petId | DELETE     | 404        `);
  });

  it('reportCoverage: undefined', async () => {
    apiSchema.shouldPlugin(should, { apiDefinitionsPath });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.callCount(this.spy, 0);
  });

  it('reportCoverage: false', async () => {
    apiSchema.shouldPlugin(should, { apiDefinitionsPath, reportCoverage: false });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.callCount(this.spy, 0);
  });
});
