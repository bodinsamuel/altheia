import TypeBase from './base';
import arrayDiff = require('./utils/arraydiff');
import { LangList, ValidatorErrorRaw } from './types/global';

export const messages: LangList = {
  'array.typeof': (name) => `${name} must be a valid array`,
  'array.min': (name, args) =>
    `${name} must contains at least ${args.min} items`,
  'array.max': (name, args) =>
    `${name} must contains at most ${args.max} items`,
  'array.in': (name, args) =>
    `${name} must only contains these keys [${args.in}]`,
  'array.not': (name) => `${name} contains forbidden value`,
  'array.unique': (name) => `${name} can not contains duplicated value`,
  'array.oneOf': (name) => `${name} contains forbidden items`,
  'array.itemInvalid': (name) =>
    `${name} does not match any of the allowed types`,
};

/**
 * Array class
 */
export class TypeArray extends TypeBase {
  /**
   * Constructor
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'array';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof(): this {
    this.test('typeof', (str) => {
      return Array.isArray(str);
    });
    return this;
  }

  /**
   * Force an array to contains at least a number of items equal to the value passed.
   *
   * @param  {number} min
   * @return {Base}
   */
  min(min: number): this {
    this.test(
      'min',
      (str) => {
        return str.length >= min;
      },
      { min }
    );

    return this;
  }

  /**
   * Force an array to contains at most a number of items equal to the value passed.
   *
   * @param  {number} max
   * @return {Base}
   */
  max(max: number): this {
    this.test(
      'max',
      (str) => {
        return str.length <= max;
      },
      { max }
    );

    return this;
  }

  /**
   * Force an array to have only the keys passed in the set
   *
   * @param  {...string} array
   * @return {Base}
   */
  in(...array: string[]): this {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'in',
      (str) => {
        return arrayDiff(str, only).length === 0;
      },
      { in: only }
    );

    return this;
  }

  /**
   * Force an array not to have the keys passed in the set
   *
   * @param  {...string} array
   * @return {Base}
   */
  not(...array: string[]): this {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as string[];
    }

    this.test(
      'not',
      (str) => {
        return arrayDiff(only, str).length === only.length;
      },
      { not: only }
    );

    return this;
  }

  /**
   * Force an array to only have each item once
   *
   * @return {Base}
   */
  unique(): this {
    this.test('unique', (str) => {
      const a = new Set(str);
      return a.size === str.length;
    });

    return this;
  }

  /**
   * Force all array's items to match one of the template
   *
   * @param  {...Validator} templates
   * @return {Base}
   */
  oneOf(...templates: TypeBase[]): this {
    this.test(
      'oneOf',
      async (array) => {
        const errors: ValidatorErrorRaw[] = [];

        await Promise.all(
          array.map(async (value: any, index: number) => {
            let error: ValidatorErrorRaw | undefined = undefined;

            const label = 'item';
            for (var i = 0; i < templates.length; i++) {
              const test = await templates[i].required().validate(value);
              if (test) {
                error = { label, test, position: index } as ValidatorErrorRaw;
              } else {
                // early break if one template matched (returned no error)
                return;
              }
            }

            // Help typescript understand we have error here
            if (!error) {
              return;
            }

            // if multiples templates, return a generic message
            if (templates.length > 1) {
              error = {
                label,
                test: this.createTestResult(
                  this.createTest({
                    type: 'array.itemInvalid',
                  }),
                  false
                ),
                position: index,
              };
              errors.push(error);
            } else {
              errors.push(error);
            }
          })
        );

        return {
          valid: errors.length <= 0,
          error: 'not_matching',
          errors,
        };
      },
      { templates }
    );

    return this;
  }
}

const def = {
  Class: TypeArray,
  messages,
};

export default def;
