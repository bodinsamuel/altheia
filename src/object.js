const arrayDiff = require('./utils/arraydiff');
const isPlainObject = require('lodash/isPlainObject');

const Base = require('./base');

module.exports = class object extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return isPlainObject(str);
    });
    return this;
  }

  in(...array) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = array[0];
    }

    this.test('in', (str) => {
      const diff = arrayDiff(Object.keys(str), only);
      return diff.length === 0;
    }, { in: only });
    return this;
  }

  not(...array) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = array[0];
    }

    this.test('not', (str) => {
      const diff = arrayDiff(only, Object.keys(str));
      return diff.length === only.length;
    }, { not: only });
    return this;
  }
};
