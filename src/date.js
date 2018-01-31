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
};
