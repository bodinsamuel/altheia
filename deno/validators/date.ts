import { TypeBase } from './base.ts';
import { LangList } from '../types/lang.ts';
import { TestFunctionReturn } from '../types/tests.ts';

/* eslint-disable */
const iso = new RegExp(
  /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/
);
/* eslint-enable */

export const messages: LangList = {
  'date.typeof': (name): string => `${name} must be a valid date`,
  'date.iso': (name): string => `${name} must be an ISO-8601 date`,
  'date.min': (name, { min }: { min: Date }): string =>
    `${name} must be at least ${min.toISOString()}`,
  'date.max': (name, { max }: { max: Date }): string =>
    `${name} must be less than or equal to ${max.toISOString()}`,
};

/**
 * Date class
 */
export class TypeDate extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'date';
    this.typeof();
  }

  /**
   * Try to cast value
   *
   * @param {mixed} value
   * @return {Date|mixed}
   */
  _cast(value: any): Date | any {
    return Date.parse(value);
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
        return !isNaN(Date.parse(val));
      }
    );
    return this;
  }

  /**
   * Force a date to be a valid ISO-8601.
   *
   * @return {this}
   */
  iso(): this {
    this.test(
      'iso',
      (date: string): TestFunctionReturn => {
        return date.match(iso) !== null;
      }
    );
    return this;
  }

  /**
   * Force a date to be a at least or bigger than value passed
   *
   * @param  {Date} min
   * @return {this}
   */
  min(min: Date): this {
    this.test(
      'min',
      (date: string): TestFunctionReturn => {
        if (
          typeof min !== 'object' ||
          min.constructor.name !== 'Date' ||
          min.toString() === 'Invalid Date'
        ) {
          return false;
        }
        return Date.parse(date) >= min.getTime();
      },
      { min }
    );
    return this;
  }

  /**
   * Force a date to be less or equal than value passed
   *
   * @param  {Date} max
   * @return {this}
   */
  max(max: Date): this {
    this.test(
      'max',
      (date: string): TestFunctionReturn => {
        if (
          typeof max !== 'object' ||
          max.constructor.name !== 'Date' ||
          max.toString() === 'Invalid Date'
        ) {
          return false;
        }
        return Date.parse(date) <= max.getTime();
      },
      { max }
    );
    return this;
  }
}

const def = {
  Class: TypeDate,
  messages,
};

export default def;
