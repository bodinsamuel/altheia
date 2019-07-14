import arrayDiff from './utils/arraydiff';
import isPlainObject from 'lodash/isPlainObject';

import TypeBase from './base';
import Validator from './validator';
import { LangList } from './types/global';

export const messages: LangList = {
  'object.typeof': (name) => `${name} must be a valid object`,
  'object.in': (name, args) =>
    `${name} must only contains these keys [${args.in}]`,
  'object.not': (name) => `${name} contains forbidden value`,
  'object.schema': (name) => `${name} has not a valid schema`,
  'object.oneOf': (name, args, result) => {
    if (result.error === 'oneIsRequired') {
      return `${name} must contain one of these keys [${args.keys}]`;
    }
    if (result.keys) {
      return `${name} can not contain these two keys [${
        result.keys
      }] at the same time`;
    }
    return 'unknown error';
  },
  'object.allOf': (name, args) =>
    `${name} must contain either none or all of these keys [${args.keys}]`,
};

/**
 * Object class
 */
export class TypeObject extends TypeBase {
  /**
   * Constructor
   *
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'object';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
      return isPlainObject(str);
    });
    return this;
  }

  /**
   * Force an object to have only the keys passed in the set
   *
   * @param  {...string} array
   * @return {Base}
   */
  in(...array: (string | object)[]) {
    let only = array;
    let oneErrorPerKey = false;

    // handle someone passing literal array instead of multiple args
    if (array.length > 0 && Array.isArray(array[0])) {
      if (isPlainObject(array[1])) {
        oneErrorPerKey = (!!array[1] as any).oneErrorPerKey;
      }
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'in',
      (str) => {
        const diff = arrayDiff(Object.keys(str), only);
        if (oneErrorPerKey && diff.length > 0) {
          return {
            valid: false,
            error: 'in',
            errors: diff.map((label) => {
              return {
                test: this.createTestResult(
                  this.createTest({ type: 'forbidden' }),
                  false
                ),
                label,
              };
            }),
          };
        }
        return diff.length === 0;
      },
      { in: only }
    );
    return this;
  }

  /**
   * Force an object to not have the keys passed in the set
   *
   * @param  {...string} array
   * @return {Base}
   */
  not(...array: string[]) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'not',
      (str) => {
        const diff = arrayDiff(only, Object.keys(str));
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
   * @return {Base}
   */
  schema(schema: Validator, { returnErrors = true } = {}) {
    if (typeof schema.isValidator === 'undefined') {
      if (!isPlainObject(schema)) {
        throw new Error(
          'schema should be an instance of altheia validator "Alt({ ... })" or a plain object'
        );
      }

      if (Object.keys(schema).length <= 0) {
        throw new Error('schema should have one key at least');
      }

      const Alt = require('./index');
      schema = Alt(schema);
    }

    this.test(
      'schema',
      async (obj) => {
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
   * @return {Base}
   */
  oneOf(...params: (string | boolean)[]) {
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
      async (obj) => {
        const presence: { a: null | string; b: null | string } = {
          a: null,
          b: null,
        };

        try {
          Object.keys(obj).forEach((key) => {
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
   * @return {Base}
   */
  allOf(...keys: string[]) {
    this.test(
      'allOf',
      async (obj) => {
        return (
          Object.keys(obj).reduce((acc, k) => {
            if (keys.includes(k)) {
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
}

const def = {
  Class: TypeObject,
  messages,
};

export default def;
