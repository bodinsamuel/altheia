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

  only(array) {
    this.test('only', (str) => {
      const diff = arrayDiff(Object.keys(str), array);
      return diff.length === 0;
    });
    return this;
  }
}

module.exports = Obj;
