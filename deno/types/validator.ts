import { TypeBase } from '../validators/index.ts';

export interface ValidatorOptions {
  required?: boolean;
  unknown?: boolean;
  flatten?: boolean;
}

export interface ValidatorConfirm {
  initial: string;
  comparison: string;
}

export interface ValidatorSchema {
  [k: string]: TypeBase;
}
