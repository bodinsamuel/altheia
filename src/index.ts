import isPlainObject from 'lodash/isPlainObject';

import LangBase from './lang';
import { Validator } from './validator';
import { TypeBase } from './validators/base';
import { LangList } from './types/lang';
import { AltheiaInstance } from './types/instance';
import { ValidatorErrorFormatted, ValidatorErrorRaw } from './types/tests';
import { ValidatorSchema } from './types/validator';

// Default extractors
import AnyValidator from './validators/any';
import ArrayValidator from './validators/array';
import BooleanValidator from './validators/boolean';
import DateValidator from './validators/date';
import FunctionValidator from './validators/function';
import InternetValidator from './validators/internet';
import NumberValidator from './validators/number';
import ObjectValidator from './validators/object';
import StringValidator from './validators/string';

const Instance = (lang?: LangList): AltheiaInstance => {
  const inst: AltheiaInstance = ((schema: ValidatorSchema): Validator => {
    return new Validator(schema, inst);
  }) as AltheiaInstance;

  inst.langList = { ...LangBase };
  inst.templates = {};
  inst.Base = TypeBase;

  inst.instance = (newLang: LangList = {}): AltheiaInstance => {
    return Instance({ ...inst.langList, ...newLang });
  };

  inst.use = (plugin): AltheiaInstance => {
    const test = new plugin.Class();
    inst[test.name || test.constructor.name] = (): TypeBase => {
      return new plugin.Class(inst);
    };
    if (plugin.messages) {
      inst.lang(plugin.messages);
    }
    return inst;
  };

  inst.lang = (key, tpl): void => {
    if (typeof key === 'object' && isPlainObject(key)) {
      inst.langList = { ...inst.langList, ...key };
    } else if (typeof key === 'string' && tpl) {
      inst.langList[key] = tpl;
    }
  };

  inst.template = (name, schema): void => {
    inst.templates[name] = schema;
  };

  inst.is = (name): TypeBase => {
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
      formatted.errors = result.errors.map(
        (error: ValidatorErrorRaw): ValidatorErrorFormatted =>
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

const def = Instance();
export = def;
