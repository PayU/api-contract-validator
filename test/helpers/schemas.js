const fs = require('fs');
const path = require('path');

const BASE_DATA_PATH = path.join(__dirname, '..', 'data');

module.exports.schema = JSON.parse(fs.readFileSync(path.join(BASE_DATA_PATH, 'schema.json')));
