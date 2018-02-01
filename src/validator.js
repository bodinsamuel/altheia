const eachObject = require('lodash/forEach');
const getKeyOrDefault = require('lodash/get');
const isPlainObject = require('lodash/isPlainObject');

const ObjectValidator = require('./object');

module.exports = class Validator {
  constructor(schema, lang) {
    this._schema = {};
    this._body = {};
    this._errors = [];
    this._options = {
      required: false,
      unknown: true
    };
    this._lang = lang;

    this.schema(schema);
  }

  body(body) {
    this._body = body;
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

  getError(type, label, args) {
    // Get messages from error
    let msg;
    if (typeof this._lang[type] !== 'undefined') {
      msg = this._lang[type](label, args);
    } else {
      msg = 'invalid';
    }

    return {
      name: label,
      error: type,
      message: msg
    };
  }

  async validate(callback) {
    if (this._options.unknown === false) {
      const only = await new ObjectValidator().in(Object.keys(this._schema)).validate(this._body);
      if (only) {
        if (callback) {
          callback(only);
        }
        return only;
      }
    }

    const errors = [];

    // Use old syntax to allow await in loop without using promise.all
    const keys = Object.keys(this._schema);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = this._schema[key];
      const value = getKeyOrDefault(this._body, key, null);

      // If not required pass
      if (value === null && this._options.required === true) {
        item.required();
      }

      const hasError = await item.validate(value);
      if (!hasError) {
        continue;
      }

      errors.push(this.getError(hasError.name, key, hasError.args));
    }

    if (errors.length > 0) {
      if (callback) {
        callback(errors);
      }
      return errors;
    }

    if (callback) {
      callback(false);
    }
    return false;
  }
};
