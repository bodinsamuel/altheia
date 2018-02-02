const { URL } = require('url');

const Base = require('./base');
const Luhn = require('./utils/luhn');

// eslint-disable-next-line
const hostname = new RegExp(/^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?$/);
const uuidv4 = new RegExp(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i);

module.exports.lang = {};

module.exports.Class = class internet extends Base {
  constructor() {
    super();
    this.typeof();
  }

  typeof() {
    this.test('typeof', (str) => {
      return typeof str === 'string';
    });
    return this;
  }

  url() {
    this.test('url', (str) => {
      try {
        // eslint-disable-next-line
        if (str.search('javascript:') === 0) {
          return false;
        }
        return new URL(str);
      } catch (e) {
        return false;
      }
    });
    return this;
  }

  hostname() {
    this.test('hostname', (str) => {
      return str.match(hostname) !== null;
    });
    return this;
  }

  hex() {
    this.test('hex', (str) => {
      return str.match(/^[a-f0-9]+$/i) !== null;
    });
    return this;
  }

  creditCard() {
    this.test('creditCard', (str) => {
      if (/[^0-9-\s]+/.test(str)) {
        return false;
      }
      str = str.replace(/\D/, '');
      if (str.length < 13) {
        return false;
      }
      return Luhn(str);
    });
    return this;
  }

  uuidv4() {
    this.test('uuidv4', (str) => {
      if (str.length < 32) {
        return false;
      }
      return uuidv4.test(str);
    });
    return this;
  }
};
