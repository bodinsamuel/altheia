import { TypeBase } from './base';
import { LangList } from '../typings/lang';
import { TestFunctionReturn } from '../typings/tests';

export const messages: LangList = {
  'number.typeof': (name): string => `${name} must be a valid number`,
  'number.min': (name, args: { min: number }): string =>
    `${name} must be at least ${args.min}`,
  'number.max': (name, args: { max: number }): string =>
    `${name} must be less than or equal to ${args.max}`,
  'number.integer': (name): string => `${name} must be an integer`,
  'number.unsigned': (name): string => `${name} must be an unsigned number`,
  'number.positive': (name): string => `${name} must be a positive number`,
  'number.negative': (name): string => `${name} must be a negative number`,
  'number.in': (name, args: { obj: number[] }): string =>
    `${name} must be one of [${args.obj}]`,
  'number.not': (name): string => `${name} contains forbidden value`,
};

/**
 * Number class
 */
export class TypeNumber extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'number';
    this.typeof();
  }

  /**
   * Try to cast value
   *
   * @param {mixed} value
   * @return {Number|mixed}
   */
  _cast(value: any): number | any {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test(
      'typeof',
      (val: any): TestFunctionReturn => {
        return typeof val === 'number' && !isNaN(val) && isFinite(val);
      }
    );
    return this;
  }

  /**
   * Force a number to be equal or more to the value passed.
   *
   * @param  {number} min
   * @return {this}
   */
  min(min: number): this {
    this.test(
      'min',
      (num: number): TestFunctionReturn => {
        return num >= min;
      },
      { min }
    );
    return this;
  }

  /**
   * Force a number to be equal or less to the value passed.
   *
   * @param  {number} max
   * @return {this}
   */
  max(max: number): this {
    this.test(
      'max',
      (num: number): TestFunctionReturn => {
        return num <= max;
      },
      { max }
    );
    return this;
  }

  /**
   * Force a number to be an integer.
   *
   * @return {this}
   */
  integer(): this {
    this.test(
      'integer',
      (num: number): TestFunctionReturn => {
        return Number.isSafeInteger(num) === true;
      }
    );
    return this;
  }

  /**
   * Force a number to be unsigned.
   *
   * @return {this}
   */
  unsigned(): this {
    this.test(
      'unsigned',
      (num: number): TestFunctionReturn => {
        return num >= 0;
      }
    );
    return this;
  }

  /**
   * Force a number to be greater than 0.
   *
   * @return {this}
   */
  positive(): this {
    this.test(
      'positive',
      (num: number): TestFunctionReturn => {
        return num > 0;
      }
    );
    return this;
  }

  /**
   * Force a number to be lesser than 0.
   *
   * @return {this}
   */
  negative(): this {
    this.test(
      'negative',
      (num: number): TestFunctionReturn => {
        return num < 0;
      }
    );
    return this;
  }

  /**
   * Force a number to be equal to one of the value passed in the set.
   *
   * @param  {...number} obj
   * @return {this}
   */
  in(...obj: number[]): this {
    this.test(
      'in',
      (num: number): TestFunctionReturn => {
        return obj.includes(num) === true;
      },
      { obj }
    );

    return this;
  }

  /**
   * Force a number to be different to all of the value passed in the set.
   *
   * @param  {...number} obj
   * @return {this}
   */
  not(...obj: number[]): this {
    this.test(
      'not',
      (num: number): TestFunctionReturn => {
        return obj.includes(num) === false;
      },
      { obj }
    );

    return this;
  }
}

const def = {
  Class: TypeNumber,
  messages,
};

export default def;
