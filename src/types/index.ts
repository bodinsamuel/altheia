import TypeBase from '../base';
import Validator from '../validator';
import { TypeString } from '../string';
import { TypeAny } from '../any';
import { TypeArray } from '../array';
import { TypeBoolean } from '../boolean';
import { TypeDate } from '../date';
import { TypeFunc } from '../function';
import { TypeInternet } from '../internet';
import { TypeNumber } from '../number';
import { TypeObject } from '../object';

// ---------- Altheia
export interface ValidatorTemplates {
  [k: string]: TypeBase;
}

export interface AltheiaInstance {
  // All plugins are here
  [k: string]: any;

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
    { type, args, result }: ValidatorTestResult,
    label?: string,
    position?: number
  ) => ValidatorErrorFormatted;

  any: () => TypeAny;
  array: () => TypeArray;
  boolean: () => TypeBoolean;
  date: () => TypeDate;
  func: () => TypeFunc;
  internet: () => TypeInternet;
  number: () => TypeNumber;
  object: () => TypeObject;
  string: () => TypeString;
}

export interface BaseConstructor {
  new (instance?: AltheiaInstance): TypeBase;
}

// ---------- Lang
export type LangFunction = (name: string, args?: any, result?: any) => string;

export interface LangList {
  [k: string]: LangFunction;
}

// ---------- Validator
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

// ---------- Tests Public

export interface ValidatorTestResult {
  valid: boolean;
  type: string;
  func: TestFunction;
  args: any;
  result?: ValidatorInternalTestResult;
}

export interface ValidatorErrorRaw {
  test: ValidatorTestResult;
  label: string;
  position?: number;
}

export interface ValidatorErrorFormatted {
  label: string;
  type: string;
  message: string;
  position?: number;
  errors?: ValidatorErrorFormatted[];
}

export type TestFunction = (
  params: any
) =>
  | Promise<boolean | ValidatorInternalTestResult>
  | boolean
  | ValidatorInternalTestResult;

// ---------- Tests Private
export interface ValidatorInternalTest {
  type: string;
  func: TestFunction;
  args: any;
}

export interface ValidatorInternalTestResult {
  valid: boolean;
  error: string;
  overrideWith?: ValidatorTestResult;
  errors?: ValidatorErrorRaw[];
}
