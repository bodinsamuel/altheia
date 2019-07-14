import TypeBase from '../base';
import Validator from '../validator';

// ---------- Altheia
export interface ValidatorTemplates {
  [k: string]: TypeBase;
}

export interface AltheiaInstance {
  (schema: ValidatorSchema): Validator;

  langList: LangList;
  templates: ValidatorTemplates;
  Base: typeof TypeBase;

  instance: (lang?: LangList) => AltheiaInstance;
  use: (plugin: { Class: BaseConstructor; messages?: LangList }) => this;
  lang: (key: LangList | string, tpl?: LangFunction) => void;
  template: (name: string, schema: TypeBase) => void;
  is: (name: string) => TypeBase;
  formatError: (
    { name, args, result }: ValidatorTest,
    label: string,
    position?: number
  ) => ValidatorError;

  // All plugins are here
  [k: string]: any;
}

export interface BaseConstructor {
  new (instance?: AltheiaInstance): TypeBase;
}

// ---------- Lang
export type LangFunction = (name: string, args: any, result: any) => string;

export type LangList = {
  [k: string]: LangFunction;
};

// ---------- Validator
export interface ValidatorResult {
  isValid: boolean;
  error: string;
  errors?: ValidatorError[];
}

export interface ValidatorError {
  label: string;
  type: string;
  message: string;
  position?: number;
  errors?: ValidatorError[];
  test: ValidatorTest;
}

export interface ValidatorOptions {
  required: boolean;
  unknown: boolean;
}

export interface ValidatorConfirm {
  initial: string;
  comparison: string;
}

export interface ValidatorSchema {
  [k: string]: TypeBase;
}

export interface ValidatorTest {
  name: string;
  isValid: boolean;
  func: TestFunction;
  args: any;
  result?: any;
}

export type ChainFunction = (validator: TypeBase) => TypeBase;

export type TestFunction = (
  params: any
) => Promise<boolean | ValidatorResult> | boolean | ValidatorResult;
