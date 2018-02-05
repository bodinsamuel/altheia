const isPlainObject = require('lodash/isPlainObject');
const isEqual = require('lodash/isEqual');

const ObjectValidator = require('./object').Class;

module.exports = class Validator {
  constructor(schema, inst) {
    this.inst = inst;
    this._schema = {};
    this._body = {};
    this._errors = [];
    this._confirm = [];
    this._options = {
      required: false,
      unknown: true
    };

    this.schema(schema);
  }

  body(body) {
    this._body = Object.assign({}, body);
    return this;
  }

  schema(schema) {
    if (!isPlainObject(schema)) {
      throw new Error('schema should be object');
    }
    this._schema = schema;
    return this;
  }

  options(options) {
    if (!isPlainObject(options)) {
      throw new Error('schema should be object');
    }
    this._options = Object.assign(this._options, options);
    return this;
  }

  formatError(error, label) {
    return this.inst.formatError(error, label);
  }

  callback(callback, result) {
    if (callback) {
      callback(result);
    }
    return result;
  }

  async validate(callback) {
    if (this._options.unknown === false) {
      const only = await new ObjectValidator().in(Object.keys(this._schema)).validate(this._body);
      if (only) {
        return this.callback(callback, [this.formatError(only, 'schema')]);
      }
    }

    const errors = [];

    // Use old syntax to allow await in loop without using promise.all
    const keys = Object.keys(this._schema);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = this._schema[key];
      const value = typeof this._body[key] !== 'undefined' ? this._body[key] : null;
      this._body[key] = value;

      // If not required pass
      if (value === null && this._options.required === true) {
        item.required();
      }

      const hasError = await item.validate(value);
      if (!hasError) {
        continue;
      }

      errors.push(this.formatError(hasError, key));
    }
    this._errors = errors;

    // Check confirm after validation
    if (this._confirm.length > 0) {
      this._confirm.forEach((item) => {
        const initial = this._body[item.initial];
        const comparison = this._body[item.comparison];
        if (isEqual(initial, comparison)) {
          return;
        }
        this._errors.push(this.formatError({ name: 'confirm', args: item }, item.comparison));
      });
    }

    if (errors.length > 0) {
      return this.callback(callback, errors);
    }

    return this.callback(callback, false);
  }

  confirm(initial, comparison) {
    this._confirm.push({ initial, comparison });
    return this;
  }
};
