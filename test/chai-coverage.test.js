const path = require('path');
const sinon = require('sinon');
const chalk = require('chalk');
const { use } = require('chai');

const apiSchema = require('../lib/index');
const coverage = require('../lib/helpers/coverage');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');

describe('Chai.js plugin coverage', () => {
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
    use(apiSchema.chaiPlugin({ apiDefinitionsPath, reportCoverage: true }));

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.calledThrice(this.spy);
    sinon.assert.calledWith(this.spy.firstCall, chalk.bold('* API definitions coverage report *'));
    sinon.assert.calledWith(this.spy.secondCall, chalk.red('\nUncovered API definitions found'));
    sinon.assert.calledWith(this.spy.thirdCall, `${chalk.cyan.underline.bold('*ROUTE*')}        | ${chalk.green.underline.bold('*METHOD*')}   | ${chalk.yellow.underline.bold('*STATUSES*')} \n/v2/pet        | POST       | 405        \n/v2/pet        | PUT        | 400,404,405\n/v2/pet/:petId | GET        | 200        \n/v2/pet/:petId | POST       | 405        \n/v2/pet/:petId | DELETE     | 404        `);
  });

  it('reportCoverage: undefined', async () => {
    use(apiSchema.chaiPlugin({ apiDefinitionsPath }));

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.notCalled(this.spy);
  });

  it('reportCoverage: false', async () => {
    use(apiSchema.chaiPlugin({ apiDefinitionsPath, reportCoverage: false }));

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');
    sinon.assert.notCalled(this.spy);
  });

  it('reportCoverage: true', async () => {
    use(apiSchema.chaiPlugin({ apiDefinitionsPath, reportCoverage: true }));

    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'get', status: 200 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'delete', status: 404 });

    // emit exit event in order to trigger the reporting
    process.emit('beforeExit');

    sinon.assert.calledTwice(this.spy);
    sinon.assert.calledWith(this.spy.firstCall, chalk.bold('* API definitions coverage report *'));
    sinon.assert.calledWith(this.spy.secondCall, chalk.green('\nAll API definitions are covered\n'));
  });
});
