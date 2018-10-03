const Base = require('./base');
const arrayDiff = require('./utils/arraydiff');

module.exports.lang = {
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
  'array.itemInvalid': (name) => `${name} does not match any of the allowed types`,
};

/**
 * Array class
 */
class array extends Base {
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
  typeof() {
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
  min(min) {
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
  max(max) {
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
  in(...array) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = array[0];
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
  not(...array) {
    let only = array;
    // handle someone passing literal array instead of multiple args
    if (array.length === 1 && Array.isArray(array[0])) {
      only = array[0];
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
  unique() {
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
  oneOf(...templates) {
    this.test(
      'oneOf',
      async (array) => {
        const errors = [];
        await Promise.all(array.map(async (value) => {
          let error = false;

          for (var i = 0; i < templates.length; i++) {
            const test = await templates[i].validate(value);
            if (test) {
              error = { label: value, test };
            } else {
              // early break if one template matched (returned no error)
              return;
            }
          }

          // if multiples templates, return a generic message
          if (templates.length > 1) {
            errors.push({ label: value, test: { name: 'array.itemInvalid' } });
          } else {
            errors.push(error);
          }
        }));

        return {
          isValid: errors.length <= 0,
          error: 'not_matching',
          errors,
        };
      },
      { templates }
    );

    return this;
  }
}

module.exports.Class = array;
