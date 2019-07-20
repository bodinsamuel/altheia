import Base from './base';

/**
 * Any is just a empty class to allow chaining
 */
export class TypeAny extends Base {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.name = 'any';
  }
}

const def = {
  Class: TypeAny,
};

export default def;
