const path = require('path');
const sinon = require('sinon');
const chalk = require('chalk');

const apiSchema = require('../../lib/index');

const apiDefinitionsPath = path.join(__dirname, '..', 'data', 'schema.yaml');

describe('Jest plugin coverage', () => {
  const sandbox = sinon.createSandbox();

  beforeAll(() => {
    this.spy = sandbox.spy(console, 'info');
  });

  afterAll(() => {
    sandbox.restore();
  });

  afterEach(() => {
    process.removeAllListeners('beforeExit');
    sandbox.resetHistory();
  });

  it('reportCoverage: true', async () => {
    apiSchema.jestPlugin({ apiDefinitionsPath, reportCoverage: true });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.calledThrice(this.spy);
    sinon.assert.calledWith(this.spy.firstCall, chalk.bold('* API definitions coverage report *'));
    sinon.assert.calledWith(this.spy.secondCall, chalk.red('\nUncovered API definitions found'));
    sinon.assert.calledWith(this.spy.thirdCall, `${chalk.cyan.underline.bold('*ROUTE*')}        | ${chalk.green.underline.bold('*METHOD*')}   | ${chalk.yellow.underline.bold('*STATUSES*')} \n/v2/pet        | POST       | 405        \n/v2/pet        | PUT        | 400,404,405\n/v2/pet/:petId | GET        | 200        \n/v2/pet/:petId | POST       | 405        \n/v2/pet/:petId | DELETE     | 404        `);
  });

  it('reportCoverage: undefined', async () => {
    apiSchema.jestPlugin({ apiDefinitionsPath });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.notCalled(this.spy);
  });

  it('reportCoverage: false', async () => {
    apiSchema.jestPlugin({ apiDefinitionsPath, reportCoverage: false });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.notCalled(this.spy);
  });
});
