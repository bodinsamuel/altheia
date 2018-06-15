const Base = require('./base');

module.exports.lang = {
  'boolean.typeof': (name) => `${name} must be a valid boolean`,
  'boolean.true': (name) => `${name} must be true`,
  'boolean.false': (name) => `${name} must be false`,
};

module.exports.Class = class boolean extends Base {
  constructor() {
    super();
    this.name = 'boolean';
    this.typeof();
  }

  _cast(value) {
    if (typeof value === 'string') {
      if (value === 'true' || value === 'True') {
        return true;
      } else if (value === 'false' || value === 'False') {
        return false;
      }
    }
    return value;
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'boolean';
    });
    return this;
  }

  true() {
    this.test('true', (str) => {
      return str === true;
    });
    return this;
  }

  false() {
    this.test('false', (str) => {
      return str === false;
    });
    return this;
  }
};
