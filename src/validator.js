const eachObject = require('lodash/forEach');
const getKeyOrDefault = require('lodash/get');
const isPlainObject = require('lodash/isPlainObject');

const ObjectValidator = require('./object');

module.exports = class Valoche {
  constructor(schema) {
    this.schema(schema);
    this._body = {};
    this._errors = [];
    this._options = {
      required: false,
      unknown: true
    };
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
      const only = await new ObjectValidator().only(Object.keys(this._schema)).validate(this._body);
      if (only) {
        return only;
      }
    }

    const response = [];
    await eachObject(this._schema, async (item, key) => {
      const value = getKeyOrDefault(this._body, key, null);
      console.log('validating', key);
      await item.validate(value, (error) => {
        response.push({ name: item.name, error });
      });
    });

    if (response.length > 0) {
      return response;
    }
    return true;
  }
};
