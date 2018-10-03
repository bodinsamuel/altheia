const Base = require('./base');

module.exports.lang = {
  'boolean.typeof': (name) => `${name} must be a valid boolean`,
  'boolean.true': (name) => `${name} must be true`,
  'boolean.false': (name) => `${name} must be false`,
};

/**
 * Boolean class
 */
class boolean extends Base {
  /**
   * Constructor
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'boolean';
    this.typeof();
  }

  /**
   * Try to cast value
   *
   * @param {mixed} value
   * @return {boolean|mixed}
   */
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

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'boolean';
    });
    return this;
  }

  /**
   * Force a boolean to equal true
   *
   * @return {Base}
   */
  true() {
    this.test('true', (str) => {
      return str === true;
    });
    return this;
  }

  /**
   * Force a boolean to equal false
   *
   * @return {Base}
   */
  false() {
    this.test('false', (str) => {
      return str === false;
    });
    return this;
  }
}

module.exports.Class = boolean;
