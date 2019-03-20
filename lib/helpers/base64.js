module.exports.encode = (string) => {
  const buffer = Buffer.from(string);

  return buffer.toString('base64');
};

module.exports.decode = (string) => {
  const buffer = Buffer.from(string, 'base64');

  return buffer.toString();
};
