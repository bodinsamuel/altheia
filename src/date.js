const Base = require('./base');

// eslint-disable-next-line
const iso = new RegExp(/^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/);

module.exports = class date extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return !isNaN(Date.parse(str));
    });
    return this;
  }

  iso() {
    this.test('iso', (str) => {
      return str.match(iso) !== null;
    });
    return this;
  }
};
