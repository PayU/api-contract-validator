const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { expect } = require('chai');
const sinon = require('sinon');

const coverage = require('../lib/helpers/coverage');
const coverageTable = require('../lib/helpers/coverage-table');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');

describe('coverage getReport', () => {
  afterEach(() => {
    process.removeAllListeners('beforeExit');
  });

  it('partial coverage', () => {
    const expected = [
      {
        route: '/v2/pet/:petId',
        method: 'GET',
        statuses: '200',
      },
      { route: '/v2/pet/:petId', method: 'POST', statuses: '405' },
      {
        route: '/v2/pet/:petId',
        method: 'DELETE',
        statuses: '404',
      },
    ];

    coverage.init({ apiDefinitionsPath, reportCoverage: true });
    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    expect(coverage.getReport()).to.eql(expected);
  });

  it('full coverage', () => {
    const expected = [];

    coverage.init({ apiDefinitionsPath, reportCoverage: true });
    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'get', status: 200 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'delete', status: 404 });
    expect(coverage.getReport()).to.eql(expected);
  });
});

describe('coverage printReport', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    process.removeAllListeners('beforeExit');
    sandbox.resetHistory();
    sandbox.restore();
  });

  it('no covered definitions', () => {
    const expected = '\u001b[36m\u001b[4m\u001b[1m*ROUTE*\u001b[22m\u001b[24m\u001b[39m        | \u001b[32m\u001b[4m\u001b[1m*METHOD*\u001b[22m\u001b[24m\u001b[39m   | \u001b[33m\u001b[4m\u001b[1m*STATUSES*\u001b[22m\u001b[24m\u001b[39m \n/v2/pet        | POST       | 405        \n/v2/pet        | PUT        | 400,404,405\n/v2/pet/:petId | GET        | 200        \n/v2/pet/:petId | POST       | 405        \n/v2/pet/:petId | DELETE     | 404        ';

    coverage.init({ apiDefinitionsPath, reportCoverage: true });
    const coverageReport = coverage.getReport();
    expect(coverageTable(coverageReport)).to.eql(expected);
  });

  it('no covered definitions with export and report', () => {
    const expected = '[{"route":"/v2/pet","method":"POST","statuses":"405"},{"route":"/v2/pet","method":"PUT","statuses":"400,404,405"},{"route":"/v2/pet/:petId","method":"GET","statuses":"200"},{"route":"/v2/pet/:petId","method":"POST","statuses":"405"},{"route":"/v2/pet/:petId","method":"DELETE","statuses":"404"}]';

    coverage.init({ apiDefinitionsPath, reportCoverage: true, exportCoverage: true });
    process.emit('beforeExit');
    const exportedReport = fs.readFileSync('./coverage.json').toString();
    expect(exportedReport).to.eql(expected);
  });

  it('no covered definitions with export and without report', () => {
    const expected = '[{"route":"/v2/pet","method":"POST","statuses":"405"},{"route":"/v2/pet","method":"PUT","statuses":"400,404,405"},{"route":"/v2/pet/:petId","method":"GET","statuses":"200"},{"route":"/v2/pet/:petId","method":"POST","statuses":"405"},{"route":"/v2/pet/:petId","method":"DELETE","statuses":"404"}]';

    coverage.init({ apiDefinitionsPath, exportCoverage: true });
    process.emit('beforeExit');
    const exportedReport = fs.readFileSync('./coverage.json').toString();
    expect(exportedReport).to.eql(expected);
  });

  it('full coverage', () => {
    const expected = '';

    coverage.init({ apiDefinitionsPath, reportCoverage: true });
    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'get', status: 200 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'delete', status: 404 });

    const coverageReport = coverage.getReport();
    expect(coverageTable(coverageReport)).to.eql(expected);
  });

  it('full coverage and with export', () => {
    const expected = '[]';

    coverage.init({ apiDefinitionsPath, reportCoverage: true, exportCoverage: true });
    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'get', status: 200 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'delete', status: 404 });

    process.emit('beforeExit');
    const exportedReport = fs.readFileSync('./coverage.json').toString();
    expect(exportedReport).to.eql(expected);
  });

  it('error from export with report disabled', () => {
    const writeFileSyncStub = sandbox.stub(fs, 'writeFileSync');
    const consoleInfoStub = sandbox.stub(console, 'info');
    writeFileSyncStub.throws(new Error('failed to read file'))
    coverage.init({ apiDefinitionsPath, exportCoverage: true });
    process.emit('beforeExit');
    sinon.assert.calledThrice(consoleInfoStub);
    sinon.assert.calledWith(consoleInfoStub.firstCall, chalk.red('Error writing report to file'));
    sinon.assert.calledWith(consoleInfoStub.secondCall, chalk.red('failed to read file'));

  });

  it('error from export with report enabled and fully covered', () => {
    const writeFileSyncStub = sandbox.stub(fs, 'writeFileSync');
    const consoleInfoStub = sandbox.stub(console, 'info');
    writeFileSyncStub.throws(new Error('failed to read file'))
    coverage.init({ apiDefinitionsPath, reportCoverage: true, exportCoverage: true });
    coverage.setCoverage({ path: '/v2/pet', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 400 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 404 });
    coverage.setCoverage({ path: '/v2/pet', method: 'put', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'get', status: 200 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'post', status: 405 });
    coverage.setCoverage({ path: '/v2/pet/123', method: 'delete', status: 404 });
    process.emit('beforeExit');
    sinon.assert.callCount(consoleInfoStub, 5);
    sinon.assert.calledWith(consoleInfoStub.firstCall, chalk.bold('* API definitions coverage report *'));
    sinon.assert.calledWith(consoleInfoStub.secondCall, chalk.green('\nAll API definitions are covered\n'));
    sinon.assert.calledWith(consoleInfoStub.thirdCall, chalk.red('Error writing report to file'));
    sinon.assert.calledWith(consoleInfoStub.getCall(3), chalk.red('failed to read file'));

  });
});
