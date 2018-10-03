const Base = require('./base');

/* eslint-disable */
const iso = new RegExp(
  /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/
);
/* eslint-enable */

module.exports.lang = {
  'date.typeof': (name) => `${name} must be a valid date`,
  'date.iso': (name) => `${name} must be an ISO-8601 date`,
  'date.min': (name, { min }) =>
    `${name} must be at least ${min.toISOString()}`,
  'date.max': (name, { max }) =>
    `${name} must be less than or equal to ${max.toISOString()}`,
};

/**
 * Date class
 */
class date extends Base {
  /**
   * Constructor
   *
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'date';
    this.typeof();
  }

  /**
   * Try to cast value
   *
   * @param {mixed} value
   * @return {Date|mixed}
   */
  _cast(value) {
    return Date.parse(value);
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
      return !isNaN(Date.parse(str));
    });
    return this;
  }

  /**
   * Force a date to be a valid ISO-8601.
   *
   * @return {Base}
   */
  iso() {
    this.test('iso', (str) => {
      return str.match(iso) !== null;
    });
    return this;
  }

  /**
   * Force a date to be a at least or bigger than value passed
   *
   * @param  {Date} min
   * @return {Base}
   */
  min(min) {
    this.test(
      'min',
      (str) => {
        if (
          typeof min !== 'object' ||
          min.constructor.name !== 'Date' ||
          min.toString() === 'Invalid Date'
        ) {
          return false;
        }
        return Date.parse(str) >= min;
      },
      { min }
    );
    return this;
  }

  /**
   * Force a date to be less or equal than value passed
   *
   * @param  {Date} max
   * @return {Base}
   */
  max(max) {
    this.test(
      'max',
      (str) => {
        if (
          typeof max !== 'object' ||
          max.constructor.name !== 'Date' ||
          max.toString() === 'Invalid Date'
        ) {
          return false;
        }
        return Date.parse(str) <= max;
      },
      { max }
    );
    return this;
  }
}

module.exports.Class = date;
