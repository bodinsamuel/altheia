const Base = require('./base');
const Luhn = require('./utils/luhn');
const { URL } = require('url');

// eslint-disable-next-line
const hostname = new RegExp(
  /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?$/
);
const uuidv4 = new RegExp(
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
);
const ipv4 = new RegExp(
  /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
);
const ipv6 = new RegExp(
  /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/
);

module.exports.lang = {
  'internet.typeof': (name) => `${name} must be a valid string`,
  'internet.url': (name) => `${name} must be a valid url`,
  'internet.hostname': (name) => `${name} must be a valid hostname`,
  'internet.hex': (name) => `${name} must be a valid hex`,
  'internet.creditCard': (name) => `${name} must be a valid Credit Card`,
  'internet.uuidv4': (name) => `${name} must be a valid token`,
  'internet.ip': (name) => `${name} must be a valid IP`,
  'internet.ipv4': (name) => `${name} must be a valid IP v4`,
  'internet.ipv6': (name) => `${name} must be a valid IP v6`,
};

module.exports.Class = class internet extends Base {
  constructor() {
    super();
    this.name = 'internet';
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

        // eslint-disable-next-line
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

  ip() {
    this.test('ip', (str) => {
      return ipv4.test(str) || ipv6.test(str);
    });
    return this;
  }

  ipv4() {
    this.test('ipv4', (str) => {
      return ipv4.test(str);
    });
    return this;
  }

  ipv6() {
    this.test('ipv6', (str) => {
      return ipv6.test(str);
    });
    return this;
  }
};
