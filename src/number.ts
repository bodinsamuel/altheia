import TypeBase from './base';
import { LangList } from './types/global';

export const messages: LangList = {
  'number.typeof': (name) => `${name} must be a valid number`,
  'number.min': (name, args) => `${name} must be at least ${args.min}`,
  'number.max': (name, args) =>
    `${name} must be less than or equal to ${args.max}`,
  'number.integer': (name) => `${name} must be an integer`,
  'number.unsigned': (name) => `${name} must be an unsigned number`,
  'number.positive': (name) => `${name} must be a positive number`,
  'number.negative': (name) => `${name} must be a negative number`,
  'number.in': (name, args) => `${name} must be one of [${args.obj}]`,
  'number.not': (name) => `${name} contains forbidden value`,
};

/**
 * Number class
 */
export class TypeNumber extends TypeBase {
  /**
   * Constructor
   * @return {Base}
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
  _cast(value: any) {
    if (typeof value === 'string') {
      return parseFloat(value);
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
      return typeof str === 'number' && !isNaN(str) && isFinite(str);
    });
    return this;
  }

  /**
   * Force a number to be equal or more to the value passed.
   *
   * @param  {number} min
   * @return {Base}
   */
  min(min: number) {
    this.test(
      'min',
      (str) => {
        return str >= min;
      },
      { min }
    );
    return this;
  }

  /**
   * Force a number to be equal or less to the value passed.
   *
   * @param  {number} max
   * @return {Base}
   */
  max(max: number) {
    this.test(
      'max',
      (str) => {
        return str <= max;
      },
      { max }
    );
    return this;
  }

  /**
   * Force a number to be an integer.
   *
   * @return {Base}
   */
  integer() {
    this.test('integer', (str) => {
      return Number.isSafeInteger(str) === true;
    });
    return this;
  }

  /**
   * Force a number to be unsigned.
   *
   * @return {Base}
   */
  unsigned() {
    this.test('unsigned', (str) => {
      return str >= 0;
    });
    return this;
  }

  /**
   * Force a number to be greater than 0.
   *
   * @return {Base}
   */
  positive() {
    this.test('positive', (str) => {
      return str > 0;
    });
    return this;
  }

  /**
   * Force a number to be lesser than 0.
   *
   * @return {Base}
   */
  negative() {
    this.test('negative', (str) => {
      return str < 0;
    });
    return this;
  }

  /**
   * Force a number to be equal to one of the value passed in the set.
   *
   * @param  {...number} obj
   * @return {Base}
   */
  in(...obj: number[]) {
    this.test(
      'in',
      (str) => {
        return obj.includes(str) === true;
      },
      { obj }
    );

    return this;
  }

  /**
   * Force a number to be different to all of the value passed in the set.
   *
   * @param  {...number} obj
   * @return {Base}
   */
  not(...obj: number[]) {
    this.test(
      'not',
      (str) => {
        return obj.includes(str) === false;
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
