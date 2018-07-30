const Base = require('./base');

module.exports.lang = {};

module.exports.Class = class any extends Base {
  constructor() {
    super();
    this.name = 'any';
  }
};
