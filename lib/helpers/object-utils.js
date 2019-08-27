module.exports.filterMissingProps = (obj, requiredProps) => requiredProps
  .filter((prop) => obj[prop] === undefined);
