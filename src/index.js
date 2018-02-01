const clone = require('lodash/clone');

const LangBase = require('./lang');
const Validator = require('./validator');
const StringValidator = require('./string');
const ObjectValidator = require('./object');
const NumberValidator = require('./number');
const DateValidator = require('./date');

const Instance = (lang) => {
  const inst = (schema) => {
    return new Validator(schema, inst);
  };

  inst.string = () => {
    return new StringValidator();
  };

  inst.number = () => {
    return new NumberValidator();
  };

  inst.date = () => {
    return new DateValidator();
  };

  inst.object = () => {
    return new ObjectValidator();
  };

  inst.instance = (lang) => {
    return Instance(lang);
  };

  inst.templates = {};
  inst.template = (name, schema) => {
    inst.templates[name] = schema;
  };

  inst.is = (name) => {
    if (typeof inst.templates[name] === 'undefined') {
      throw new Error(`unknow template ${name}`);
    }

    return inst.templates[name].clone();
  };

  inst.langList = Object.assign({}, LangBase, lang);
  inst.lang = (key, tpl) => {
    inst.langList[key] = tpl;
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
      message: msg
    };
  };

  return inst;
};

module.exports = Instance();
