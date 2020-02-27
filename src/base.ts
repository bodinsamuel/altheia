import {
  ValidatorInternalTest,
  TestFunction,
  AltheiaInstance,
  ValidatorInternalTestResult,
  ValidatorTestResult,
} from './types';
import { createTest, createTestResult } from './utils/createTest';

/**
 * All type inherit this Class
 */
class TypeBase {
  inst: AltheiaInstance;

  tests: (() => ValidatorInternalTest)[];

  name?: string;

  _required: boolean;

  _needCast: boolean;

  _noEmpty?: boolean;

  /**
   * Constructor
   *
   * @param  {Altheia} inst
   */
  constructor(inst?: AltheiaInstance) {
    this.inst = inst || require('./index');
    this.tests = [];

    this._required = false;
    this._needCast = false;
  }

  /**
   * Clone this class
   *
   * @return {TypeBase}
   */
  clone<T extends this>(): T {
    const clone = Object.assign(Object.create(this), this) as T;
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
    callback?: (value: false | ValidatorTestResult) => void
  ): Promise<false | ValidatorTestResult> {
    // Return an object and call a callback if needed
    const returnOrCallback = (
      result: false | ValidatorTestResult,
      callback?: (value: false | ValidatorTestResult) => void
    ): false | ValidatorTestResult => {
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

    if (this._needCast) {
      // @ts-ignore
      toTest = await this._cast(toTest);
    }

    // Iterate all tests
    for (let i = 0; i < this.tests.length; i++) {
      const test = this.tests[i]();

      // Special condition for IF() we need to display error of deep validation
      let internalResult: ValidatorInternalTestResult;

      internalResult = this.testToTestResult(await test.func(toTest));

      // Let test override current test type/arguments
      // Helps when you encapsulate test inside other test and want a transparent error
      //   e.g: `if()`
      if (internalResult.overrideWith) {
        test.type = internalResult.overrideWith.type;
        test.args = internalResult.overrideWith.args;
      }

      if (
        typeof internalResult.error === 'undefined' ||
        typeof internalResult.valid === 'undefined'
      ) {
        throw new Error(
          'test() should return a boolean or an object { valid: boolean, error: string }'
        );
      }

      // Do not go deeper in test
      if (!internalResult.valid) {
        return returnOrCallback(
          this.createTestResult(test, internalResult.valid, internalResult),
          callback
        );
      }
    }

    return returnOrCallback(false, callback);
  }

  /**
   * Force the value to be non-null
   *
   * @return {this}
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * Force the value to be casted before any check
   *
   * @return {this}
   */
  cast(): this {
    this._needCast = true;
    return this;
  }

  /**
   * Custom validator
   *
   * @param  {string}   name
   * @param  {Function} callback
   * @param  {Function}   message
   * @return {this}
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
  presence(toTest: any): boolean {
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
      if (this._noEmpty) {
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
   * @return {this}
   */
  if<T extends this>({
    test,
    then,
    otherwise,
  }: {
    test: (chain: T) => TypeBase;
    then: (chain: T) => TypeBase;
    otherwise: (chain: T) => TypeBase;
  }): this {
    this.test('if', async (str) => {
      const clone = this.clone() as T;
      clone.tests = [];

      const hasError = await test(clone).validate(str);
      if (!hasError) {
        clone.tests = [];
        const temp = await then(clone).validate(str);
        return temp && temp.result
          ? { ...temp.result, overrideWith: temp }
          : true;
      }

      clone.tests = [];
      const temp = await otherwise(clone).validate(str);
      return temp && temp.result
        ? { ...temp.result, overrideWith: temp }
        : true;
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
