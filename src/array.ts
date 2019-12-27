import TypeBase from './base';
import arrayDiff from './utils/arraydiff';
import { LangList, ValidatorErrorRaw } from './types';

export const messages: LangList = {
  'array.typeof': (name) => `${name} must be a valid array`,
  'array.min': (name, args: { min: number }) =>
    `${name} must contains at least ${args.min} items`,
  'array.max': (name, args: { max: number }) =>
    `${name} must contains at most ${args.max} items`,
  'array.in': (name, args: { in: string[] }) =>
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
   */
  constructor() {
    super();
    this.name = 'array';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test('typeof', (val: any) => {
      return Array.isArray(val);
    });
    return this;
  }

  /**
   * Force an array to contains at least a number of items equal to the value passed.
   *
   * @param  {number} min
   * @return {this}
   */
  min(min: number): this {
    this.test(
      'min',
      (arr: any[]) => {
        return arr.length >= min;
      },
      { min }
    );

    return this;
  }

  /**
   * Force an array to contains at most a number of items equal to the value passed.
   *
   * @param  {number} max
   * @return {this}
   */
  max(max: number): this {
    this.test(
      'max',
      (arr: any[]) => {
        return arr.length <= max;
      },
      { max }
    );

    return this;
  }

  /**
   * Force an array to have only the values passed in the set
   *
   * @param  {...array} array
   * @return {this}
   */
  in(value: any[]): this;
  in(...value: any): this;
  in(...array: any): this {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as any[];
    }

    this.test(
      'in',
      (arr: any[]) => {
        return arrayDiff<string>(arr, only).length === 0;
      },
      { in: only }
    );

    return this;
  }

  /**
   * Force an array not to have the values passed in the set
   *
   * @param  {...array} array
   * @return {this}
   */
  not(value: any[]): this;
  not(...value: any): this;
  not(...array: any[]): this {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = (array[0] as unknown) as any[];
    }

    this.test(
      'not',
      (arr: any[]) => {
        return arrayDiff(only, arr).length === only.length;
      },
      { not: only }
    );

    return this;
  }

  /**
   * Force an array to only have each item once
   *
   * @return {this}
   */
  unique(): this {
    this.test('unique', (arr: any[]) => {
      const a = new Set(arr);
      return a.size === arr.length;
    });

    return this;
  }

  /**
   * Force all array's items to match one of the template
   *
   * @param  {...Validator} templates
   * @return {this}
   */
  oneOf(...templates: TypeBase[]): this {
    this.test(
      'oneOf',
      async (arr: any[]) => {
        const errors: ValidatorErrorRaw[] = [];

        await Promise.all(
          arr.map(async (value: any, index: number) => {
            let error: ValidatorErrorRaw | undefined = undefined;

            const label = 'item';
            for (var i = 0; i < templates.length; i++) {
              const test = await templates[i].required().validate(value);
              if (test) {
                error = { label, test, position: index };
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
