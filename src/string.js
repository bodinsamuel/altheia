const Base = require('./base');

class Str extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'string';
    });
    return this;
  }

  min(min) {
    this.test('min', (str) => {
      return str.length >= min;
    });
    return this;
  }

  max(max) {
    this.test('max', (str) => {
      return str.length <= max;
    });
    return this;
  }

  pattern(regex) {
    this.test('pattern', (str) => {
      return str.match(regex) !== null;
    });
    return this;
  }

  in(...obj) {
    this.test('in', (str) => {
      return obj.includes(str) === true;
    });
    return this;
  }

  not(...obj) {
    this.test('not', (str) => {
      return obj.includes(str) === false;
    });
    return this;
  }

  custom(callback) {
    this.test('custom', async (str) => {
      try {
        return await callback(str);
      } catch (e) {
        return false;
      }
    });
    return this;
  }
}

module.exports = Str;
