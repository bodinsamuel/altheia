import TypeBase from './base';
import { LangList } from './types';

export const messages: LangList = {
  'function.typeof': (name) => `${name} must be a valid function`,
};

/**
 * Function class
 */
export class TypeFunc extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'function';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test('typeof', (str: any) => {
      return typeof str === 'function';
    });
    return this;
  }
}

const def = {
  Class: TypeFunc,
  messages,
};

export default def;
