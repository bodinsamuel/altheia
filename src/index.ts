import isPlainObject = require('lodash/isPlainObject');

import LangBase from './lang';
import Validator from './validator';
import TypeBase from './base';
import {
  LangList,
  AltheiaInstance,
  ValidatorSchema,
  ValidatorTemplates,
  ValidatorErrorFormatted,
  ValidatorErrorRaw,
} from './types/global';

// Default extractors
import AnyValidator from './any';
import ArrayValidator from './array';
import BooleanValidator from './boolean';
import DateValidator from './date';
import FunctionValidator from './function';
import InternetValidator from './internet';
import NumberValidator from './number';
import ObjectValidator from './object';
import StringValidator from './string';

const Instance = (lang?: LangList): AltheiaInstance => {
  const inst: AltheiaInstance = (schema: ValidatorSchema): Validator => {
    return new Validator(schema, inst);
  };

  inst.langList = Object.assign({}, LangBase);
  inst.templates = {} as ValidatorTemplates;
  inst.Base = TypeBase;

  inst.instance = (newLang: LangList = {}) => {
    return Instance(Object.assign({}, inst.langList, newLang));
  };

  inst.use = (plugin) => {
    const test = new plugin.Class();
    inst[test.name || test.constructor.name] = () => {
      return new plugin.Class(inst);
    };
    if (plugin.messages) {
      inst.lang(plugin.messages);
    }
    return inst;
  };

  inst.lang = (key, tpl) => {
    if (isPlainObject(key)) {
      inst.langList = Object.assign({}, inst.langList, key);
    } else if (typeof key === 'string' && tpl) {
      inst.langList[key] = tpl;
    }
  };

  inst.template = (name, schema) => {
    inst.templates[name] = schema;
  };

  inst.is = (name) => {
    if (typeof inst.templates[name] === 'undefined') {
      throw new Error(`unknow template ${name}`);
    }

    return inst.templates[name].clone();
  };

  inst.formatError = (
    { type, args, result },
    label = 'value',
    position
  ): ValidatorErrorFormatted => {
    // Get messages from error
    let msg;
    if (typeof inst.langList[type] !== 'undefined') {
      msg = inst.langList[type](label, args, result);
    } else {
      msg = 'Invalid value';
    }

    const formatted: ValidatorErrorFormatted = {
      label,
      type,
      message: msg,
    };

    if (typeof position === 'number') {
      formatted.position = position;
    }

    // nested errors
    if (result && result.errors) {
      formatted.errors = result.errors.map((error: ValidatorErrorRaw) =>
        inst.formatError(error.test, error.label, error.position)
      );
    }
    return formatted;
  };

  // Declare basic plugins
  inst.use(AnyValidator);
  inst.use(ArrayValidator);
  inst.use(BooleanValidator);
  inst.use(DateValidator);
  inst.use(FunctionValidator);
  inst.use(InternetValidator);
  inst.use(NumberValidator);
  inst.use(ObjectValidator);
  inst.use(StringValidator);

  // Add passed lang object
  if (lang && isPlainObject(lang)) {
    inst.lang(lang);
  }

  return inst;
};

export default Instance();
