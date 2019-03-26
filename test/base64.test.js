const { expect } = require('chai');

const base64 = require('../lib/helpers/base64');

describe('base64', () => {
  const str = '#%this.is.random_string%$%';

  it('encode', () => {
    expect(base64.encode(str)).to.eql('IyV0aGlzLmlzLnJhbmRvbV9zdHJpbmclJCU=');
  });

  it('decode', () => {
    const encodedStr = base64.encode(str);
    expect(base64.decode(encodedStr)).to.eql(str);
  });
});
