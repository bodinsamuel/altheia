const arrayDiff = require('lodash/difference');
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
    }, { in: array });
    return this;
  }
};
