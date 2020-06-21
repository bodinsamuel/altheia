import { TypeBase } from './base.ts';

/**
 * Any is just a empty class to allow chaining
 */
export class TypeAny extends TypeBase {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'any';
  }

  _cast(): void {
    throw new Error('not available for this validator');
  }
}

const def = {
  Class: TypeAny,
};

export default def;
