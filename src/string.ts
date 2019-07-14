import TypeBase from './base';
import { LangList } from './lang';

export const messages: LangList = {
  'string.typeof': (name) => `${name} must be a valid string`,
  'string.empty': (name) => `${name} can not be empty`,
  'string.min': (name, args) =>
    `${name} must be at least ${args.min} characters long`,
  'string.max': (name, args) =>
    `${name} must be at most ${args.max} characters long`,
  'string.pattern': (name, args) =>
    `${name} must match pattern "${args.regex}"`,
  'string.in': (name, args) => `${name} must be one of [${args.obj}]`,
  'string.not': (name) => `${name} contains forbidden value`,
  'string.email': (name) => `${name} must be a valid email`,
  'string.lowercase': (name) => `${name} must be lowercase only`,
  'string.uppercase': (name) => `${name} must be uppercase only`,
};

/**
 * String class
 */
export class TypeString extends TypeBase {
  /**
   * Constructor
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'string';
    this._no_empty = false;
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'string';
    });
    return this;
  }

  /**
   * Force a string to be not empty
   *
   * @return {Base}
   */
  noEmpty() {
    this._no_empty = true;
    this.test('empty', (str) => {
      return str.length > 0;
    });
    return this;
  }

  /**
   * Force a string to be equal or more to the value passed.
   *
   * @param  {number} min
   * @return {Base}
   */
  min(min: number) {
    this.test(
      'min',
      (str) => {
        return str.length >= min;
      },
      { min }
    );

    return this;
  }

  /**
   * Force a string to be equal or less to the value passed.
   *
   * @param  {number} max
   * @return {Base}
   */
  max(max: number) {
    this.test(
      'max',
      (str) => {
        return str.length <= max;
      },
      { max }
    );

    return this;
  }

  /**
   * Force a string to match the regex passed.
   *
   * @param  {Regex} regex
   * @return {Base}
   */
  pattern(regex: RegExp) {
    this.test(
      'pattern',
      (str) => {
        return str.match(regex) !== null;
      },
      { regex }
    );

    return this;
  }

  /**
   * Force a string to be equal to one of the value passed in the set.
   *
   * @param  {...string} obj
   * @return {Base}
   */
  in(...obj: string[]) {
    this.test(
      'in',
      (str) => {
        return obj.includes(str) === true;
      },
      { obj }
    );

    return this;
  }

  /**
   * Force a string to be different to all of the value passed in the set.
   *
   * @param  {...string} obj
   * @return {Base}
   */
  not(...obj: string[]) {
    this.test(
      'not',
      (str) => {
        return obj.includes(str) === false;
      },
      { obj }
    );

    return this;
  }

  /**
   * Force a string to be a valid email (contain an @).
   *
   * @return {Base}
   */
  email() {
    this.test('email', (str) => {
      return str.search('@') >= 0;
    });

    return this;
  }

  /**
   * Force a string to be fully in lowercase.
   *
   * @return {Base}
   */
  lowercase() {
    this.test('lowercase', (str) => {
      return str.toLocaleLowerCase() === str;
    });

    return this;
  }

  /**
   * Force a string to be fully in uppercase.
   *
   * @return {Base}
   */
  uppercase() {
    this.test('uppercase', (str) => {
      return str.toLocaleUpperCase() === str;
    });

    return this;
  }
}

const def = {
  Class: TypeString,
  messages,
};

export default def;
