const Base = require('./base');

module.exports.lang = {
  'number.typeof': (name) => `${name} must be a valid number`,
  'number.min': (name, args) => `${name} must be at least ${args.min}`,
  'number.max': (name, args) =>
    `${name} must be less than or equal to ${args.max}`,
  'number.integer': (name) => `${name} must be an integer`,
  'number.unsigned': (name) => `${name} must be an unsigned number`,
  'number.positive': (name) => `${name} must be a positive number`,
  'number.negative': (name) => `${name} must be a negative number`,
};

module.exports.Class = class number extends Base {
  constructor() {
    super();
    this.name = 'number';
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'number';
    });
    return this;
  }

  min(min) {
    this.test(
      'min',
      (str) => {
        return str >= min;
      },
      { min }
    );
    return this;
  }

  max(max) {
    this.test(
      'max',
      (str) => {
        return str <= max;
      },
      { max }
    );
    return this;
  }

  integer() {
    this.test('integer', (str) => {
      return Number.isSafeInteger(str) === true;
    });
    return this;
  }

  unsigned() {
    this.test('unsigned', (str) => {
      return str >= 0;
    });
    return this;
  }

  positive() {
    this.test('positive', (str) => {
      return str > 0;
    });
    return this;
  }

  negative() {
    this.test('negative', (str) => {
      return str < 0;
    });
    return this;
  }
};
