import TypeBase from './base';
import { LangList } from './types/global';

export const messages: LangList = {
  'boolean.typeof': (name) => `${name} must be a valid boolean`,
  'boolean.true': (name) => `${name} must be true`,
  'boolean.false': (name) => `${name} must be false`,
};

/**
 * Boolean class
 */
export class TypeBoolean extends TypeBase {
  /**
   * Constructor
   * @return {Base}
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
      } else if (value === 'false' || value === 'False') {
        return false;
      }
    }
    return value;
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof(): this {
    this.test('typeof', (str) => {
      return typeof str === 'boolean';
    });
    return this;
  }

  /**
   * Force a boolean to equal true
   *
   * @return {Base}
   */
  true(): this {
    this.test('true', (str) => {
      return str === true;
    });
    return this;
  }

  /**
   * Force a boolean to equal false
   *
   * @return {Base}
   */
  false(): this {
    this.test('false', (str) => {
      return str === false;
    });
    return this;
  }
}

const def = {
  Class: TypeBoolean,
  messages,
};

export default def;
