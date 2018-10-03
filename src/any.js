const Base = require('./base');

module.exports.lang = {};

/**
 * Any is just a empty class to allow chaining
 */
class any extends Base {
  /**
   * Constructor
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'any';
  }
}

module.exports.Class = any;
