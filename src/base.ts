import {
  ValidatorInternalTest,
  TestFunction,
  ChainFunction,
  AltheiaInstance,
  ValidatorInternalTestResult,
  ValidatorTestResult,
} from './types/global';
import { createTest, createTestResult } from './utils/createTest';

/**
 * All type inherit this Class
 */
class TypeBase {
  inst: AltheiaInstance;
  tests: (() => ValidatorInternalTest)[];
  name?: string;

  _required: boolean;
  _need_cast: boolean;
  _no_empty?: boolean;

  /**
   * Constructor
   *
   * @param  {Altheia} inst
   * @return {Base}
   */
  constructor(inst?: AltheiaInstance) {
    this.inst = inst || require('./index');
    this.tests = [];

    this._required = false;
    this._need_cast = false;
  }

  /**
   * Clone this class
   *
   * @return {Base}
   */
  clone(): TypeBase {
    const clone = Object.assign(Object.create(this), this);
    // Quick deep clone
    clone.tests = this.tests.slice(0);
    return clone;
  }

  /**
   * Add a test
   *
   * @param  {string} name
   * @param  {function} func
   * @param  {Object} args
   * @return {undefined}
   */
  test(name: string, func: TestFunction, args = {}): void {
    this.tests.push(() => {
      return this.createTest({
        type: `${this.name}.${name}`,
        func,
        args,
      });
    });
  }

  createTest = createTest;
  createTestResult = createTestResult;

  /**
   * Validate a value based on all tests added
   * @param  {mixed}   toTest
   * @param  {Function} callback
   * @return {object}
   */
  async validate(
    toTest: any,
    callback?: (value: any) => void
  ): Promise<false | ValidatorTestResult> {
    // Return an object and call a callback if needed
    const returnOrCallback = (
      result: false | ValidatorTestResult,
      callback?: (value: any) => void
    ) => {
      if (callback) {
        callback(result);
      }
      return result;
    };

    // Test presence early to fail/pass early
    const presence = this.presence(toTest);
    if (presence === false) {
      if (this._required === false) {
        return returnOrCallback(false, callback);
      }

      return returnOrCallback(
        this.createTestResult(
          this.createTest({
            type: 'required',
          }),
          false
        ),
        callback
      );
    }

    if (this._need_cast) {
      toTest = await this._cast(toTest);
    }

    // Iterate all tests
    for (var i = 0; i < this.tests.length; i++) {
      let test = this.tests[i]();

      // Special condition for IF() we need to display error of deep validation
      let result: ValidatorInternalTestResult;

      if (test.type.indexOf('.if') >= 0) {
        result = this.testToTestResult(await test.func(toTest));
      } else {
        result = this.testToTestResult(await test.func(toTest));

        if (typeof result.error === 'undefined') {
          'test() should return a boolean or an object { valid: boolean; error: string }';
          throw new Error();
        }
      }

      // Do not go deeper in test
      if (result) {
        return returnOrCallback(
          this.createTestResult(test, result.valid, result),
          callback
        );
      }
    }

    return returnOrCallback(false, callback);
  }

  /**
   * Force the value to be non-null
   *
   * @return {Base}
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * Force the value to be casted before any check
   *
   * @return {Base}
   */
  cast(): this {
    this._need_cast = true;
    return this;
  }

  _cast(_value: any): any {}

  /**
   * Custom validator
   *
   * @param  {string}   name
   * @param  {Function} callback
   * @param  {Function}   message
   * @return {Base}
   */
  custom(name: string, callback: TestFunction): this {
    this.test(
      `custom.${name}`,
      async (value: any) => {
        try {
          return await callback(value);
        } catch (e) {
          return false;
        }
      },
      {}
    );
    return this;
  }

  /**
   * Presence validation
   *
   * @param  {mixed} toTest
   * @return {boolean}
   */
  presence(toTest: any): Boolean {
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
  if({
    test,
    then,
    otherwise,
  }: {
    test: ChainFunction;
    then: ChainFunction;
    otherwise: ChainFunction;
  }): this {
    this.test('if', async (str) => {
      const clone = this.clone();
      clone.tests = [];

      const hasError = await test(clone).validate(str);
      if (!hasError) {
        clone.tests = [];
        return ((await then(clone).validate(
          str
        )) as unknown) as ValidatorInternalTestResult;
      }

      clone.tests = [];
      return ((await otherwise(clone).validate(
        str
      )) as unknown) as ValidatorInternalTestResult;
      // call 911
    });
    return this;
  }

  private testToTestResult(
    result: boolean | ValidatorInternalTestResult
  ): ValidatorInternalTestResult {
    if (typeof result === 'boolean') {
      return { valid: result, error: '' };
    }
    return result;
  }
}

export default TypeBase;