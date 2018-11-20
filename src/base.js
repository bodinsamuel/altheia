const isPlainObject = require('lodash/isPlainObject');

/**
 * All type inherit this Class
 */
class Base {
  /**
   * Constructor
   *
   * @param  {Altheia} inst
   * @return {Base}
   */
  constructor(inst = null) {
    this.inst = inst || require('./index');
    this._required = false;
    this._need_cast = false;
    this.tests = [];
  }

  /**
   * Clone this class
   *
   * @return {Base}
   */
  clone() {
    const clone = Object.assign(Object.create(this), this);
    // Quick deep clone
    clone.tests = this.tests.map((item) => {
      return Object.assign({}, item);
    });
    return clone;
  }

  /**
   * Add a test
   *
   * @param  {string} name
   * @param  {function} func
   * @param  {Object} args
   * @return {undefiend}
   */
  test(name, func, args = {}) {
    this.tests.push(() => ({
      name: `${this.name}.${name}`,
      func,
      args,
      isValid: true,
      result: {},
    }));
  }

  /**
   * Return a test default ibject
   * @param  {string}  options.name      The name of the test
   * @param  {Boolean} options.isValid   Has the test passed ?
   * @param  {function}  options.func    The function to call
   * @param  {object}  options.args      The arguments to pass to the function
   * @param  {Object}  options.result    The result of the function
   * @return {object}                    The final test object
   */
  createTest({ name, isValid = true, func = null, args = null, result = {} }) {
    return {
      name,
      func,
      args,
      isValid,
      result,
    };
  }

  /**
   * Validate a value based on all tests added
   * @param  {mixed}   toTest
   * @param  {Function} callback
   * @return {object}
   */
  async validate(toTest, callback = null) {
    // Return an object and call a callback if needed
    const returnOrCallback = (callback, result) => {
      if (callback) {
        callback(result);
      }
      return result;
    };

    // Test presence early to fail/pass early
    const presence = this.presence(toTest);
    if (presence === false) {
      if (this._required === false) {
        return returnOrCallback(callback, false);
      }

      return returnOrCallback(callback, this.createTest({
        name: 'required',
        isValid: false,
      }));
    }

    if (this._need_cast) {
      toTest = await this._cast(toTest);
    }

    // Iterate all tests
    for (var i = 0; i < this.tests.length; i++) {
      let test = this.tests[i]();

      // Special condition for IF() we need to display error of deep validation
      if (test.name.indexOf('.if') >= 0) {
        test = await test.func(toTest);
      } else {
        const result = await test.func(toTest);
        const resultIsObject = isPlainObject(result);

        // Check result format
        let isResultOkay = true;
        if (resultIsObject) {
          if (
            typeof result.isValid === 'undefined' ||
            typeof result.error === 'undefined'
          ) {
            isResultOkay = false;
          }
        } else if (typeof result !== 'boolean') {
          isResultOkay = false;
        }

        if (!isResultOkay) {
          throw new Error(
            'test() should return a boolean or an object { isValid:boolean, error:string }'
          );
        }

        test.isValid = resultIsObject ? result.isValid : result;
        test.result = resultIsObject ? result : {};
      }

      // Do not go deeper in test
      if (test.isValid === false) {
        return returnOrCallback(callback, test);
      }
    }

    return returnOrCallback(callback, false);
  }

  /**
   * Force the value to be non-null
   *
   * @return {Base}
   */
  required() {
    this._required = true;
    return this;
  }

  /**
   * Force the value to be casted before any check
   *
   * @return {Base}
   */
  cast() {
    this._need_cast = true;
    return this;
  }

  /**
   * Custom validator
   *
   * @param  {string}   name
   * @param  {Function} callback
   * @param  {Function}   message
   * @return {Base}
   */
  custom(name, callback, message) {
    if (typeof name !== 'string') {
      throw new Error(
        'first param of custom() must the unique name of this test'
      );
    }

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
   *
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
   * If validation
   *
   * @param  {function} options.test
   * @param  {function} options.then
   * @param  {function} options.otherwise
   * @return {Base}
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
}

module.exports = Base;
