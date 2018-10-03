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

/**
 * Internet class
 */
class internet extends Base {
  /**
   * Constructor
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'internet';
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
   * Force a string to be a valid url (RFC)
   *
   * @return {Base}
   */
  url() {
    this.test('url', (str) => {
      try {
        // eslint-disable-next-line
        if (str.search('javascript:') === 0) {
          return false;
        }

        // eslint-disable-next-line
        new URL(str);
        return true;
      } catch (e) {
        return false;
      }
    });
    return this;
  }

  /**
   * Force a string to be a valid hostname (RFC)
   *
   * @return {Base}
   */
  hostname() {
    this.test('hostname', (str) => {
      return str.match(hostname) !== null;
    });
    return this;
  }

  /**
   * Force a string to be a valid hex (a-f0-9)
   *
   * @return {Base}
   */
  hex() {
    this.test('hex', (str) => {
      return str.match(/^[a-f0-9]+$/i) !== null;
    });
    return this;
  }

  /**
   * Force a string to be a valid credit card (using Luhn's algorithm)
   *
   * @return {Base}
   */
  creditCard() {
    this.test('creditCard', (str) => {
      if (/[^0-9-\s]+/.test(str)) {
        return false;
      }
      str = str.replace(/\D/g, '');
      if (str.length < 13) {
        return false;
      }
      return Luhn(str) === true;
    });
    return this;
  }

  /**
   * Force a string to be a valid uuid version 4
   *
   * @return {Base}
   */
  uuidv4() {
    this.test('uuidv4', (str) => {
      if (str.length < 32) {
        return false;
      }
      return uuidv4.test(str);
    });
    return this;
  }

  /**
   * Force a string to be a valid ipv4 or ipv6
   *
   * @return {Base}
   */
  ip() {
    this.test('ip', (str) => {
      return ipv4.test(str) || ipv6.test(str);
    });
    return this;
  }

  /**
   * Force a string to be a valid ipv4
   *
   * @return {Base}
   */
  ipv4() {
    this.test('ipv4', (str) => {
      return ipv4.test(str);
    });
    return this;
  }

  /**
   * Force a string to be a valid ipv6
   *
   * @return {Base}
   */
  ipv6() {
    this.test('ipv6', (str) => {
      return ipv6.test(str);
    });
    return this;
  }
}

module.exports.Class = internet;
