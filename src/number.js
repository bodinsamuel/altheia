const Base = require('./base');

module.exports = class Str extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'number';
    });
    return this;
  }

  min(min) {
    this.test('min', (str) => {
      return str >= min;
    });
    return this;
  }

  max(max) {
    this.test('max', (str) => {
      return str <= max;
    });
    return this;
  }

  integer() {
    this.test('integer', (str) => {
      return Number.isSafeInteger(str) === true;
    });
    return this;
  }

  unsigned() {
    this.test('unsigned', (str) => {
      return str >= 0;
    });
    return this;
  }

  positive() {
    this.test('positive', (str) => {
      return str > 0;
    });
    return this;
  }

  negative() {
    this.test('negative', (str) => {
      return str < 0;
    });
    return this;
  }
};
