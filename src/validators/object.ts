import isPlainObject from 'lodash/isPlainObject';
import arrayDiff from '../utils/arraydiff';

import { TypeBase } from './base';
import { Validator } from '../validator';
import { LangList } from '../types/lang';
import { TestFunctionReturn, ValidatorErrorRaw } from '../types/tests';

export const messages: LangList = {
  'object.typeof': (name): string => `${name} must be a valid object`,
  'object.in': (name, args: { in: string[] }): string =>
    `${name} must only contains these keys [${args.in}]`,
  'object.not': (name): string => `${name} contains forbidden value`,
  'object.schema': (name): string => `${name} does not match its schema`,
  'object.oneOf': (
    name,
    args: { keys: string[] },
    result: { error: string; keys: string[] }
  ): string => {
    if (result.error === 'oneIsRequired') {
      return `${name} must contain one of these keys [${args.keys}]`;
    }
    if (result.keys) {
      return `${name} can not contain these two keys [${result.keys}] at the same time`;
    }
    return 'unknown error';
  },
  'object.allOf': (name, args: { keys: string[] }): string =>
    `${name} must contain either none or all of these keys [${args.keys}]`,
  'object.anyOf': (name, args: { keys: string[] }): string =>
    `${name} must contain at least one of these keys [${args.keys}]`,
};

export interface OptionsIn {
  oneErrorPerKey: boolean;
}

/**
 * Object class
 */
export class TypeObject extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'object';
    this.typeof();
  }

  _cast(): void {
    throw new Error('not available for this validator');
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test('typeof', (val: any): boolean => {
      return isPlainObject(val);
    });
    return this;
  }

  /**
   * Force an object to have only the keys passed in the set
   */
  in(...array: string[]): this;

  in(array: string[]): this;

  in(array: string[], options: OptionsIn): this;

  in(...array: (string | string[] | OptionsIn)[]): this {
    let only = array;
    let options: OptionsIn = { oneErrorPerKey: false };

    // handle someone passing literal array instead of multiple args
    if (array.length > 0 && Array.isArray(array[0])) {
      if (isPlainObject(array[1])) {
        options = { ...(array[1] as any) };
      }
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'in',
      (obj: object): TestFunctionReturn => {
        const diff = arrayDiff<string>(Object.keys(obj), only);
        if (diff.length <= 0) {
          return true;
        }

        if (options.oneErrorPerKey) {
          return {
            valid: false,
            error: 'in',
            errors: diff.map(
              (label): ValidatorErrorRaw => {
                return {
                  test: this.createTestResult(
                    this.createTest({ type: 'forbidden' }),
                    false
                  ),
                  label,
                };
              }
            ),
          };
        }

        return false;
      },
      { in: only }
    );
    return this;
  }

  /**
   * Force an object to not have the keys passed in the set
   *
   * @param  {...string} array
   * @return {this}
   */
  not(...array: string[]): this;

  not(array: string[]): this;

  not(...array: (string | string[])[]): this {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'not',
      (obj: object): TestFunctionReturn => {
        const diff = arrayDiff(only, Object.keys(obj));
        return diff.length === only.length;
      },
      { not: only }
    );
    return this;
  }

  /**
   * Validate an object with a fully qualified schema
   *
   * @param  {Altheia} schema
   * @param  {boolean} options.returnErrors If true, deep errors while be returned too
   * @return {this}
   */
  schema(schema: Validator, { returnErrors = true } = {}): this {
    if (typeof schema.isValidator === 'undefined') {
      throw new Error(
        'schema should be an instance of altheia validator "Alt({ ... })"'
      );
    }

    this.test(
      'schema',
      async (obj: object): Promise<TestFunctionReturn> => {
        const clone = schema.clone();
        const hasError = await clone.body(obj).validate();
        return {
          valid: hasError === false,
          error: 'schema',
          errors: hasError && returnErrors ? clone._errorsRaw : undefined,
        };
      },
      { schema }
    );
    return this;
  }

  /**
   * Force any keys, to be the only one present in the object
   *  (exclusive relationships)
   *  oneIsRequired is false by default
   *
   * @param  {mixed} params
   * @return {this}
   */
  oneOf(...params: string[]): this;

  oneOf(oneIsRequired: boolean, ...params: string[]): this;

  oneOf(...params: (string | boolean)[]): this {
    if (params.length <= 1) {
      throw new Error('oneOf expect at least 2 params');
    }

    let oneIsRequired = false;
    let keys: string[] = [];
    if (typeof params[0] === 'boolean') {
      oneIsRequired = params[0] as boolean;
      keys = params.splice(1) as string[];
    } else {
      keys = params as string[];
    }

    this.test(
      'oneOf',
      (obj: object): TestFunctionReturn => {
        const presence: { a: null | string; b: null | string } = {
          a: null,
          b: null,
        };

        try {
          Object.keys(obj).forEach((key): void => {
            if (keys.includes(key)) {
              if (!presence.a) {
                presence.a = key;
              } else if (!presence.b) {
                presence.b = key;
                throw new Error('a and b can not be present at the same time');
              }
            }
          });
        } catch (e) {
          return {
            valid: false,
            error: 'exclusion',
            keys: Object.values(presence),
          };
        }

        if (oneIsRequired && !presence.a && !presence.b) {
          return { valid: false, error: 'oneIsRequired' };
        }

        return true;
      },
      { oneIsRequired, keys }
    );
    return this;
  }

  /**
   * Force all keys to be mutually required. If one is presents, all are required. Pass if none are present.
   *
   * @param  {...string} keys
   * @return {this}
   */
  allOf(...keys: string[]): this {
    this.test(
      'allOf',
      (obj: object): TestFunctionReturn => {
        return (
          Object.keys(obj).reduce((acc, k): number => {
            if (keys.includes(k)) {
              // eslint-disable-next-line no-param-reassign
              acc += 1;
            }
            return acc;
          }, 0) === keys.length
        );
      },
      { keys }
    );
    return this;
  }

  /**
   * Force one or many keys to be present
   *
   * @param  {...string} keys
   * @return {this}
   */
  anyOf(...keys: string[]): this {
    this.test(
      'anyOf',
      (obj: object): TestFunctionReturn => {
        return (
          Object.keys(obj).reduce((acc, k): number => {
            if (keys.includes(k)) {
              // eslint-disable-next-line no-param-reassign
              acc += 1;
            }
            return acc;
          }, 0) >= 1
        );
      },
      { keys }
    );
    return this;
  }
}

const def = {
  Class: TypeObject,
  messages,
};

export default def;
