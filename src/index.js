const clone = require('lodash/clone');

const Validator = require('./validator');
const StringValidator = require('./string');
const ObjectValidator = require('./object');
const NumberValidator = require('./number');
const DateValidator = require('./date');

function Api(schema) {
  return new Validator(schema);
}

Api.string = () => {
  return new StringValidator();
};
Api.number = () => {
  return new NumberValidator();
};
Api.date = () => {
  return new DateValidator();
};
Api.object = () => {
  return new ObjectValidator();
};

Api.instance = () => {
  const inst = clone(Api);
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
  return inst;
};

module.exports = Api;
