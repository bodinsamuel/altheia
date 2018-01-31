const Validator = require('./validator');
const StringValidator = require('./string');
const ObjectValidator = require('./object');
const NumberValidator = require('./number');

function Api(schema) {
  return new Validator(schema);
}

Api.string = () => {
  return new StringValidator();
};
Api.number = () => {
  return new NumberValidator();
};
Api.object = () => {
  return new ObjectValidator();
};

module.exports = Api;
