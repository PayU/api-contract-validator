const fs = require('fs');
const {
  chain, set, isEmpty,
} = require('lodash');
const yaml = require('js-yaml');
const deref = require('json-schema-deref-sync');
const chalk = require('chalk');
const columnify = require('columnify');
const { buildValidations } = require('api-schema-builder');

const base64 = require('./base64');

const coverage = {};

module.exports.schemaMap = new Proxy({}, {
  get: (schemaMap, filePath) => {
    if (!schemaMap[filePath]) {
      const referenced = yaml.load(fs.readFileSync(filePath), 'utf8');
      const dereferenced = deref(referenced);

      // eslint-disable-next-line no-param-reassign
      schemaMap[filePath] = buildValidations(referenced, dereferenced, { formats });
    }
    return schemaMap[filePath];
  },
});

module.exports.getValidatorByPathMethodAndCode = (schema, request, response) => {
  const route = pathMatcher(schema, request.path);

  return chain(schema)
    .get(`${route}.${request.method}.responses.${response.status}`)
    .value();
};

function pathMatcher(schema, path) {
  return Object.keys(schema).reduce((prev, route) => {
    const matcher = route
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\//g, '.');
    const re = new RegExp(`^${matcher}$`, 'i');

    if (re.exec(path)) {
      return route;
    }

    return prev;
  }, undefined);
}

module.exports.markCovered = (filePath, { path, method, status }) => {
  const schema = module.exports.schemaMap[filePath];
  const route = pathMatcher(schema, path);

  set(coverage, `[${base64.encode(filePath)}][${route}|${method}|${status}]`, true);
};

module.exports.validateCoverage = () => {
  const schemaPath = Object.keys(coverage)[0];
  const schema = module.exports.schemaMap[base64.decode(schemaPath)];
  const data = Object
    .keys(schema)
    .map((route) => {
      const a = chain(schema[route])
        .keys()
        .map(method => ({
          method,
          statuses: Object
            .keys(schema[route][method].responses)
            .filter(status => !(coverage[`${route}|${method}|${status}`]))
            .toString(),
        }))
        .filter(({ statuses }) => statuses)
        .reduce((prev, { method, statuses }) => {
          if (method && statuses) {
            return {
              methods: (prev.methods || []).concat(method.toUpperCase()),
              statuses: (prev.statuses || []).concat(statuses),
            };
          }
          return prev;
        }, {})
        .value();

      if (a.methods && a.statuses) {
        return { route, method: a.methods.join('\n'), statuses: a.statuses.join('\n') };
      }
    })
    .filter(e => e)
    .map(({ route, method, statuses }) => ({ route, method, statuses }));

  // eslint-disable-next-line no-console
  console.info(chalk.bold('* API definitions coverage report *'));
  if (data.length === 0) {
    console.info(chalk.green('- All API definitions are covered\n'));
  } else {
    // eslint-disable-next-line no-console
    console.info(chalk.red('The following API definitions are not covered\n'));
    console.info(columnify(data, {
      preserveNewLines: true,
      columnSplitter: ' | ',
      minWidth: 10,
      headingTransform(title) {
        switch (title) {
          // case 'statuses':
          //   return chalk.yellow.bold(`*${title.toUpperCase()}*`);
          // case 'method':
          //   return chalk.green.bold(`*${title.toUpperCase()}*`);
          default:
            return chalk.cyan.underline.bold(`*${title.toUpperCase()}*`);
        }
      },

    }));
  }
};

/* istanbul ignore next */
const formats = [
  {
    name: 'int64',
    pattern: {
      validate: /^\d{1,19}$/,
      type: 'number',
    },
  },
  {
    name: 'int32',
    pattern: {
      validate: value => Number.isSafeInteger(value),
      type: 'number',
    },
  },
  {
    name: 'float',
    pattern: {
      validate: value => Number.parseFloat(value) === value,
      type: 'number',
    },
  },
  {
    name: 'double',
    pattern: {
      validate: /^-?\d+(\.\d{1,})?/,
      type: 'number',
    },
  },
];
