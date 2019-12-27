import isPlainObject from 'lodash/isPlainObject';
import isEqual from 'lodash/isEqual';

import { TypeObject } from './object';
import {
  ValidatorConfirm,
  ValidatorOptions,
  ValidatorSchema,
  AltheiaInstance,
  ValidatorErrorRaw,
  ValidatorErrorFormatted,
  ValidatorTestResult,
} from './types';
import { createTest, createTestResult } from './utils/createTest';
import TypeBase from './base';

export type ValidatorResult = false | ValidatorErrorFormatted[];
export type ValidatorCallback = (errors: ValidatorResult) => void;
/**
 * Validator class
 * new Validator({ foo: 'bar' });
 */
class Validator {
  inst: AltheiaInstance;
  isValidator: number;
  validated: boolean;

  _schema: { [key: string]: TypeBase };
  _body: any;
  _errors: ValidatorErrorFormatted[];
  _errorsRaw: ValidatorErrorRaw[];
  _confirm: ValidatorConfirm[];
  _options: ValidatorOptions;

  /**
   * Constructor
   * @param  {object} schema
   * @param  {object} inst   An Altheia instance
   */
  constructor(schema: ValidatorSchema, inst: AltheiaInstance) {
    this.inst = inst;

    this.isValidator = 1;
    this.validated = false;

    this._schema = {};
    this._body = {};
    this._errors = [];
    this._errorsRaw = [];
    this._confirm = [];
    this._options = {
      required: false,
      unknown: false,
      flatten: false,
    };

    this.schema(schema);
  }

  /**
   * Clone a validator
   * @return {Validator}
   */
  clone(): Validator {
    const clone = new Validator(this._schema, this.inst);
    clone.options(this._options);
    clone._confirm = [...this._confirm];
    return clone;
  }

  /**
   * Assign the body to validate
   *
   * @param  {object} body
   * @return {this}
   */
  body(body: any): this {
    this._body = Object.assign({}, body);
    return this;
  }

  /**
   * Declare the schema that describe the body()
   *
   * @param  {object} schema
   * @return {this}
   */
  schema(schema: ValidatorSchema): this {
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
   * @return {this}
   */
  options(options: ValidatorOptions): this {
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
   * @return {ValidatorErrorFormatted} Formatted error
   */
  formatError(
    error: ValidatorTestResult,
    label: string
  ): ValidatorErrorFormatted {
    return this.inst.formatError(error, label);
  }

  private flatten(bag: any[], error: ValidatorErrorFormatted): any[] {
    if (error.errors) {
      return error.errors.reduce(this.flatten, bag);
    }
    bag.push(error);
    return bag;
  }

  /**
   * Validate the body against the schema
   *
   * @param  {function} callback
   * @return {false | ValidatorErrorFormatted[]} Test resutls
   */
  async validate(
    body: any,
    callback?: ValidatorCallback
  ): Promise<ValidatorResult>;
  async validate(callback?: ValidatorCallback): Promise<ValidatorResult>;
  async validate(...params: any | ValidatorCallback): Promise<ValidatorResult> {
    if (this.validated) {
      throw new Error(
        'Already validated, please use .clone() to validate a different body'
      );
    }

    let callback: ValidatorCallback | undefined = undefined;
    if (params.length > 0) {
      if (typeof params[0] === 'function') {
        callback = params[0];
      } else {
        this.body(params[0]);
        callback = params[1];
      }
    }

    this.validated = true;

    // Return an object and call a callback if needed
    const returnOrCallback = (
      result: any,
      callback?: (value: ValidatorResult) => void
    ): ValidatorResult => {
      if (callback) {
        callback(result);
      }
      return result;
    };

    const errors = [];
    // Early return if unknown keys
    if (this._options.unknown === false) {
      const only = await new TypeObject()
        .in(Object.keys(this._schema), { oneErrorPerKey: true })
        .validate(this._body);

      if (typeof only !== 'boolean' && only.result && only.result.errors) {
        only.result.errors.map((error: ValidatorErrorRaw) =>
          errors.push(this.formatError(error.test, error.label))
        );
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
      if (!formatted.errors || !this._options.flatten) {
        errors.push(formatted);
      } else if (this._options.flatten && formatted.errors) {
        errors.push(...formatted.errors.reduce(this.flatten, []));
      }
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
          this.formatError(
            createTestResult(
              createTest({ type: 'confirm', args: item }),
              false
            ),
            item.comparison
          )
        );
      });
    }

    if (errors.length > 0) {
      return returnOrCallback(errors, callback);
    }

    return returnOrCallback(false, callback);
  }

  /**
   * Force the confirmation of one field by an other one
   *
   * @param  {string} initial    The first key
   * @param  {string} comparison The second key
   * @return {this}
   */
  confirm(initial: string, comparison: string): this {
    this._confirm.push({ initial, comparison });
    return this;
  }
}

export default Validator;
