const eachObject = require('lodash/forEach');
const getKeyOrDefault = require('lodash/get');
const isPlainObject = require('lodash/isPlainObject');

const ObjectValidator = require('./object');

module.exports = class Validator {
  constructor(schema) {
    this._schema = {};
    this._body = {};
    this._errors = [];
    this._options = {
      required: false,
      unknown: true
    };

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

  async validate(callback) {
    if (this._options.unknown === false) {
      const only = await new ObjectValidator().in(Object.keys(this._schema)).validate(this._body);
      if (only) {
        return only;
      }
    }

    const errors = [];
    await eachObject(this._schema, async (item, key) => {
      const value = getKeyOrDefault(this._body, key, null);
      await item.validate(value, (error) => {
        if (!error) {
          return;
        }
        errors.push({ name: key, error });
      });
    });

    if (errors.length > 0) {
      return errors;
    }
    return false;
  }
};
