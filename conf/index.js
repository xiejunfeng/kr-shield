import lodash from 'lodash';
import defaults from './defaults.js';

const ENV = process.env.NODE_ENV || 'local';
let asked = require(`./${ENV}.js`);

const conf = {};

export default lodash.assign(defaults, asked, conf);
