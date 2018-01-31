const arrayDiff = require('lodash/difference');
const isPlainObject = require('lodash/isPlainObject');

const Base = require('./base');

class Obj extends Base {
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

  only(...array) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = array[0];
    }

    this.test('only', (str) => {
      const diff = arrayDiff(Object.keys(str), only);
      return diff.length === 0;
    });
    return this;
  }
}

module.exports = Obj;
