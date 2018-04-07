const isPlainObject = require('lodash/isPlainObject');

const LangBase = require('./lang');
const Validator = require('./validator');
const BaseValidator = require('./base');
const StringValidator = require('./string');
const ObjectValidator = require('./object');
const NumberValidator = require('./number');
const DateValidator = require('./date');
const ArrayValidator = require('./array');

const Instance = (lang) => {
  const inst = (schema) => {
    return new Validator(schema, inst);
  };
  inst.langList = Object.assign({}, LangBase);
  inst.templates = {};

  inst.Base = BaseValidator;
  inst.instance = (newLang = {}) => {
    return Instance(Object.assign({}, inst.lang, newLang));
  };

  inst.use = (Plugin) => {
    const test = new Plugin.Class();
    inst[test.constructor.name] = () => {
      return new Plugin.Class();
    };
    inst.lang(Plugin.lang);
    return inst;
  };

  inst.lang = (key, tpl) => {
    if (isPlainObject(key)) {
      inst.langList = Object.assign({}, inst.langList, key);
    } else {
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

  inst.formatError = ({ name, args }, label = 'value') => {
    // Get messages from error
    let msg;
    if (typeof inst.langList[name] !== 'undefined') {
      msg = inst.langList[name](label, args);
    } else {
      msg = 'Invalid value';
    }

    return {
      label,
      type: name,
      message: msg,
    };
  };

  // Declare basic plugins
  inst.use(StringValidator);
  inst.use(NumberValidator);
  inst.use(DateValidator);
  inst.use(ObjectValidator);
  inst.use(ArrayValidator);

  // Add passed lang object
  if (lang && isPlainObject(lang)) {
    inst.lang(lang);
  }

  return inst;
};

module.exports = Instance();
