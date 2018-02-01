const cloneObj = require('lodash/clone');

module.exports = class Base {
  constructor() {
    this._required = false;
    this.tests = [];
  }

  clone() {
    const clone = Object.assign(Object.create(this), this);
    clone.tests = cloneObj(this.tests);
    return clone;
  }

  test(name, func, args = {}) {
    this.tests.push({
      name: `${this.constructor.name}.${name}`,
      func,
      args,
      isValid: true
    });
  }

  presence(toTest) {
    if (toTest === null || typeof toTest === 'undefined' || toTest === undefined) {
      return false;
    }
    if (typeof toTest === 'string' && toTest.length <= 0) {
      return false;
    }

    return true;
  }

  async validate(toTest, callback) {
    const presence = this.presence(toTest);
    if (presence === false) {
      if (this._required === false) {
        return false;
      }
      return { name: 'required', func: null, args: null, isValid: false };
    }

    for (var i = 0; i < this.tests.length; i++) {
      const test = this.tests[i];
      test.isValid = await test.func(toTest);

      if (test.isValid === false) {
        if (callback) {
          callback(test);
        }
        return test;
      }
    }

    if (callback) {
      callback(false);
    }
    return false;
  }

  /**
   * Custom validator, all type inherit this
   * @param  {Function} callback
   */
  custom(name, callback, message) {
    this.test(`custom.${name}`, async (str) => {
      try {
        return await callback(str);
      } catch (e) {
        return false;
      }
    }, {}, message);
    return this;
  }

  required() {
    this._required = true;
    return this;
  }
};
