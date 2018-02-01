const clone = require('lodash/clone');

const LangBase = require('./lang');
const Validator = require('./validator');
const StringValidator = require('./string');
const ObjectValidator = require('./object');
const NumberValidator = require('./number');
const DateValidator = require('./date');

// function Api(schema, lang = Lang) {
//   return new Validator(schema, lang);
// }

// Api.string = () => {
//   return new StringValidator();
// };
// Api.number = () => {
//   return new NumberValidator();
// };
// Api.date = () => {
//   return new DateValidator();
// };
// Api.object = () => {
//   return new ObjectValidator();
// };

const Instance = (lang) => {
  const inst = (schema) => {
    return new Validator(schema, inst.langList);
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

  return inst;
};

module.exports = Instance();
