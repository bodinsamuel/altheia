import TypeBase from './base';
import Luhn from './utils/luhn';
import url from 'url';
import { LangList } from './types';

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

export const messages: LangList = {
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
export class TypeInternet extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'internet';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test('typeof', (val: any) => {
      return typeof val === 'string';
    });
    return this;
  }

  /**
   * Force a string to be a valid url (RFC)
   *
   * @return {this}
   */
  url(): this {
    this.test('url', (str: string) => {
      try {
        // eslint-disable-next-line
        if (str.search('javascript:') === 0) {
          return false;
        }

        // eslint-disable-next-line
        new url.URL(str);
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
   * @return {this}
   */
  hostname(): this {
    this.test('hostname', (str: string) => {
      return str.match(hostname) !== null;
    });
    return this;
  }

  /**
   * Force a string to be a valid hex (a-f0-9)
   *
   * @return {this}
   */
  hex(): this {
    this.test('hex', (str: string) => {
      return str.match(/^[a-f0-9]+$/i) !== null;
    });
    return this;
  }

  /**
   * Force a string to be a valid credit card (using Luhn's algorithm)
   *
   * @return {this}
   */
  creditCard(): this {
    this.test('creditCard', (str: string) => {
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
   * @return {this}
   */
  uuidv4(): this {
    this.test('uuidv4', (str: string) => {
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
   * @return {this}
   */
  ip(): this {
    this.test('ip', (str: string) => {
      return ipv4.test(str) || ipv6.test(str);
    });
    return this;
  }

  /**
   * Force a string to be a valid ipv4
   *
   * @return {this}
   */
  ipv4(): this {
    this.test('ipv4', (str: string) => {
      return ipv4.test(str);
    });
    return this;
  }

  /**
   * Force a string to be a valid ipv6
   *
   * @return {this}
   */
  ipv6(): this {
    this.test('ipv6', (str: string) => {
      return ipv6.test(str);
    });
    return this;
  }
}

const def = {
  Class: TypeInternet,
  messages,
};

export default def;
