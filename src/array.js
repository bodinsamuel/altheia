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
};

module.exports.Class = class array extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return Array.isArray(str);
    });
    return this;
  }

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

  unique() {
    this.test('unique', (str) => {
      const a = new Set(str);
      return a.size === str.length;
    });

    return this;
  }
};
