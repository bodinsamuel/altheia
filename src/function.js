const Base = require('./base');

module.exports.lang = {
  'function.typeof': (name) => `${name} must be a valid function`,
};

/**
 * Function class
 */
class func extends Base {
  /**
   * Constructor
   *
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'function';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'function';
    });
    return this;
  }
}

module.exports.Class = func;
