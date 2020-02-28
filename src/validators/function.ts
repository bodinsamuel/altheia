import { TypeBase } from './base';
import { LangList } from '../types/lang';
import { TestFunctionReturn } from '../types/tests';

export const messages: LangList = {
  'function.typeof': (name): string => `${name} must be a valid function`,
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

  _cast(): void {
    throw new Error('not available for this validator');
  }

  /**
   * Test to validate the type of the value
   *
   * @return {this}
   */
  typeof(): this {
    this.test(
      'typeof',
      (str: any): TestFunctionReturn => {
        return typeof str === 'function';
      }
    );
    return this;
  }
}

const def = {
  Class: TypeFunc,
  messages,
};

export default def;
