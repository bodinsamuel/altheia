const isPlainObject = require('lodash/isPlainObject');

module.exports = class Base {
  constructor() {
    this._required = false;
    this._need_cast = false;
    this.tests = [];
  }

  clone() {
    const clone = Object.assign(Object.create(this), this);
    // Quick deep clone
    clone.tests = this.tests.map((item) => {
      return Object.assign({}, item);
    });
    return clone;
  }

  test(name, func, args = {}) {
    this.tests.push({
      name: `${this.name}.${name}`,
      func,
      args,
      isValid: true,
    });
  }

  callback(callback, result) {
    if (callback) {
      callback(result);
    }
    return result;
  }

  async validate(toTest, callback) {
    // Test presence early to fail/pass early
    const presence = this.presence(toTest);
    if (presence === false) {
      if (this._required === false) {
        return this.callback(callback, false);
      }

      return this.callback(callback, {
        name: 'required',
        func: null,
        args: null,
        isValid: false,
      });
    }

    if (this._need_cast) {
      toTest = await this._cast(toTest);
    }

    // Iterate all tests
    for (var i = 0; i < this.tests.length; i++) {
      let test = this.tests[i];

      // Special condition for IF() we need to display error of deep validation
      if (test.name.indexOf('.if') >= 0) {
        test = await test.func(toTest);
      } else {
        const result = await test.func(toTest);
        const resultIsObject = isPlainObject(result);
        if (resultIsObject) {
          if (
            typeof result.isValid === 'undefined' ||
            typeof result.error === 'undefined'
          ) {
            throw new Error(
              'test() should return a boolean or an object { isValid:boolean, error:string }'
            );
          }
        }

        test.isValid = resultIsObject ? result.isValid : result;
        test.args._result = resultIsObject ? result : {};
      }

      // Do not go deeper in test
      if (test.isValid === false) {
        return this.callback(callback, test);
      }
    }

    return this.callback(callback, false);
  }

  /**
   * Force the value to be non-null
   */
  required() {
    this._required = true;
    return this;
  }

  /**
   * Force the value to be casted before any check
   */
  cast() {
    this._need_cast = true;
    return this;
  }

  /**
   * Custom validator, all type inherit this
   * @param  {Function} callback
   */
  custom(name, callback, message) {
    this.test(
      `custom.${name}`,
      async (str) => {
        try {
          return await callback(str);
        } catch (e) {
          return false;
        }
      },
      {},
      message
    );
    return this;
  }

  /**
   * Presence validation
   * @param  {mixed} toTest
   * @return {boolean}
   */
  presence(toTest) {
    if (
      toTest === null ||
      typeof toTest === 'undefined' ||
      toTest === undefined
    ) {
      return false;
    }

    if (typeof toTest === 'string' && toTest.length <= 0) {
      // If the flag is passed to true
      // we consider the string valid and can be deeply tested,
      // this will trigger the noEmpty() test
      if (this._no_empty) {
        return true;
      }

      return false;
    }

    return true;
  }

  /**
   * If branch validator
   * @param  {function} args.test
   * @param  {function} args.then
   * @param  {function} args.otherwise
   */
  if({ test, then, otherwise }) {
    this.test('if', async (str) => {
      const clone = this.clone();
      clone.tests = [];

      const hasError = await test(clone).validate(str);
      if (hasError === false) {
        clone.tests = [];
        return await then(clone).validate(str);
      }

      clone.tests = [];
      return await otherwise(clone).validate(str);
    });
    return this;
  }
};
