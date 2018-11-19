const isPlainObject = require('lodash/isPlainObject');
const isEqual = require('lodash/isEqual');

const ObjectValidator = require('./object').Class;

/**
 * Validator class
 * new Validator({ foo: 'bar' });
 */
class Validator {
  /**
   * Constructor
   * @param  {object} schema
   * @param  {object} inst   An Altheia instance
   * @return {Validator}
   */
  constructor(schema, inst) {
    this.inst = inst;
    this.isValidator = 1;
    this._schema = {};
    this._body = {};
    this._errors = [];
    this._errorsRaw = [];
    this._confirm = [];
    this._options = {
      required: false,
      unknown: true,
    };

    this.schema(schema);
  }

  /**
   * Assign the body to validate
   *
   * @param  {object} body
   * @return {Validator}
   */
  body(body) {
    this._body = Object.assign({}, body);
    return this;
  }

  /**
   * Declare the schema that describe the body()
   *
   * @param  {object} schema
   * @return {Validator}
   */
  schema(schema) {
    if (!isPlainObject(schema)) {
      throw new Error('schema should be object');
    }
    this._schema = schema;
    return this;
  }

  /**
   * Declare options to change the defaults behaviour of the Validator
   *
   * @param  {object} options
   * @return {Validator}
   */
  options(options) {
    if (!isPlainObject(options)) {
      throw new Error('schema should be object');
    }
    this._options = Object.assign(this._options, options);
    return this;
  }

  /**
   * Format any Error Array returned by a test
   * @param  {object} error
   * @param  {string} label
   * @return {object}
   */
  formatError(error, label) {
    return this.inst.formatError(error, label);
  }

  /**
   * Validate the body against the schema
   *
   * @param  {Function} callback
   * @return {object}
   */
  async validate(callback = null) {
    // Return an object and call a callback if needed
    const returnOrCallback = (callback, result) => {
      if (callback) {
        callback(result);
      }
      return result;
    };


    const errors = [];
    // Early return if unknown keys
    if (this._options.unknown === false) {
      const only = await new ObjectValidator()
        .in(Object.keys(this._schema), { oneErrorPerKey: true })
        .validate(this._body);
      if (only) {
        only.result.errors.map(error => errors.push(this.formatError(error.test, error.label)));
      }
    }

    // Use old syntax to allow await in loop without using promise.all
    const keys = Object.keys(this._schema);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = this._schema[key];
      const value =
        typeof this._body[key] !== 'undefined' ? this._body[key] : null;
      this._body[key] = value;

      // If not required pass
      if (this._options.required === true) {
        item.required();
      }

      // validate the item
      const hasError = await item.validate(value);
      if (!hasError) {
        continue;
      }

      this._errorsRaw.push({ test: hasError, label: key });
      const formatted = this.formatError(hasError, key);
      errors.push(formatted);
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
        this._errors.push(
          this.formatError({ name: 'confirm', args: item }, item.comparison)
        );
      });
    }

    if (errors.length > 0) {
      return returnOrCallback(callback, errors);
    }

    return returnOrCallback(callback, false);
  }

  /**
   * Force the confirmation of one field by an other one
   *
   * @param  {string} initial    The first key
   * @param  {string} comparison The second key
   * @return {Validator}
   */
  confirm(initial, comparison) {
    this._confirm.push({ initial, comparison });
    return this;
  }
}

module.exports = Validator;
