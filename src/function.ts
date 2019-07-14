import TypeBase from './base';
import { LangList } from './types/global';

export const messages: LangList = {
  'function.typeof': (name) => `${name} must be a valid function`,
};

/**
 * Function class
 */
export class TypeFunc extends TypeBase {
  /**
   * Constructor
   *
   * @return {Base}
   */
  constructor() {
    super();
    this.name = 'function';
    this.typeof();
  }

  /**
   * Test to validate the type of the value
   *
   * @return {Base}
   */
  typeof() {
    this.test('typeof', (str) => {
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
