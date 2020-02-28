import {
  TypeBase,
  TypeAny,
  TypeArray,
  TypeBoolean,
  TypeDate,
  TypeFunc,
  TypeInternet,
  TypeNumber,
  TypeObject,
  TypeString,
} from '../validators';
import { Validator } from '../validator';

import { LangList, LangFunction } from './lang';
import { ValidatorSchema } from './validator';
import { ValidatorTestResult, ValidatorErrorFormatted } from './tests';

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
