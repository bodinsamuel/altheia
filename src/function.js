const Base = require('./base');

module.exports.lang = {
  'function.typeof': (name) => `${name} must be a valid function`,
};

module.exports.Class = class func extends Base {
  constructor() {
    super();
    this.name = 'function';
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'function';
    });
    return this;
  }
};
