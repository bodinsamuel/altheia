const Base = require('./base');

module.exports.lang = {
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

module.exports.Class = class string extends Base {
  constructor() {
    super();
    this.name = 'string';
    this._no_empty = false;
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'string';
    });
    return this;
  }

  noEmpty() {
    this._no_empty = true;
    this.test('empty', (str) => {
      return str.length > 0;
    });
    return this;
  }

  min(min) {
    this.test(
      'min',
      (str) => {
        return str.length >= min;
      },
      { min }
    );

    return this;
  }

  max(max) {
    this.test(
      'max',
      (str) => {
        return str.length <= max;
      },
      { max }
    );

    return this;
  }

  pattern(regex) {
    this.test(
      'pattern',
      (str) => {
        return str.match(regex) !== null;
      },
      { regex }
    );

    return this;
  }

  in(...obj) {
    this.test(
      'in',
      (str) => {
        return obj.includes(str) === true;
      },
      { obj }
    );

    return this;
  }

  not(...obj) {
    this.test(
      'not',
      (str) => {
        return obj.includes(str) === false;
      },
      { obj }
    );

    return this;
  }

  email() {
    this.test('email', (str) => {
      return str.search('@') >= 0;
    });

    return this;
  }

  lowercase() {
    this.test('lowercase', (str) => {
      return str.toLocaleLowerCase() === str;
    });

    return this;
  }

  uppercase() {
    this.test('uppercase', (str) => {
      return str.toLocaleUpperCase() === str;
    });

    return this;
  }
};
