const Validator = require('./validator');
const StringValidator = require('./string');
const ObjectValidator = require('./object');

function Api(schema) {
  return new Validator(schema);
}

Api.string = () => {
  return new StringValidator();
};
Api.object = () => {
  return new ObjectValidator();
};

module.exports = Api;
