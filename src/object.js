const arrayDiff = require('./utils/arraydiff');
const isPlainObject = require('lodash/isPlainObject');

const Base = require('./base');

module.exports.lang = {
  'object.typeof': (name) => `${name} must be a valid object`,
  'object.in': (name, args) =>
    `${name} must only contains these keys [${args.in}]`,
  'object.not': (name) => `${name} contains forbidden value`,
  'object.schema': (name) => `${name} has not a valid schema`,
};

module.exports.Class = class object extends Base {
  constructor() {
    super();
    this.name = 'object';
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return isPlainObject(str);
    });
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
        const diff = arrayDiff(Object.keys(str), only);
        return diff.length === 0;
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
        const diff = arrayDiff(only, Object.keys(str));
        return diff.length === only.length;
      },
      { not: only }
    );
    return this;
  }

  schema(schema, { returnErrors = false } = {}) {
    // old api
    if (isPlainObject(schema) && schema.schema) {
      if (typeof schema.returnErrors !== 'undefined') {
        returnErrors = schema.returnErrors;
      }
      schema = schema.schema;
    }

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
      console.log('schema', schema);
      schema = Alt(schema);
    }

    this.test(
      'schema',
      async (obj) => {
        const hasError = await schema.body(obj).validate();
        return hasError === false;
      },
      { schema, returnErrors }
    );
    return this;
  }
};
