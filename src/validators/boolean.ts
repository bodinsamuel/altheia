import { TypeBase } from './base';
import { LangList } from '../types/lang';
import { TestFunctionReturn } from '../types/tests';

export const messages: LangList = {
  'boolean.typeof': (name): string => `${name} must be a valid boolean`,
  'boolean.true': (name): string => `${name} must be true`,
  'boolean.false': (name): string => `${name} must be false`,
};

/**
 * Boolean class
 */
export class TypeBoolean extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'boolean';
    this.typeof();
  }

  /**
   * Try to cast value
   *
   * @param {mixed} value
   * @return {boolean|mixed}
   */
  _cast(value: any): boolean | any {
    if (typeof value === 'string') {
      if (value === 'true' || value === 'True') {
        return true;
      }
      if (value === 'false' || value === 'False') {
        return false;
      }
    }
    return value;
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test('typeof', (bool: boolean): TestFunctionReturn => {
      return typeof bool === 'boolean';
    });
    return this;
  }

  /**
   * Force a boolean to equal true
   *
   * @return {this}
   */
  true(): this {
    this.test('true', (bool: boolean): TestFunctionReturn => {
      return bool === true;
    });
    return this;
  }

  /**
   * Force a boolean to equal false
   *
   * @return {this}
   */
  false(): this {
    this.test('false', (bool: boolean): TestFunctionReturn => {
      return bool === false;
    });
    return this;
  }
}

const def = {
  Class: TypeBoolean,
  messages,
};

export default def;
