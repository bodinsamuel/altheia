const cloneObj = require('lodash/clone');

module.exports = class Base {
  constructor() {
    this.required = false;
    this.tests = [];
  }

  clone() {
    const clone = Object.assign(Object.create(this), this);
    clone.tests = cloneObj(this.tests);
    return clone;
  }

  test(name, func) {
    this.tests.push({
      name,
      func,
      isValid: true
    });
  }

  async validate(toTest, callback) {
    for (var i = 0; i < this.tests.length; i++) {
      const test = this.tests[i];
      const isValid = await test.func(toTest);
      if (isValid === false) {
        if (callback) {
          callback({ type: test.name });
        }
        return { type: test.name };
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
  custom(name, callback) {
    this.test(name, async (str) => {
      try {
        return await callback(str);
      } catch (e) {
        return false;
      }
    });
    return this;
  }

  required() {
    this.test('required', async (str) => {
      return str !== null && str !== 'undefined';
    });
    return this;
  }

  equal(ref) {
    this.test('equal', async (str) => {
      return str === this._body[ref];
    });
    return this;
  }
};
