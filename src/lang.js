module.exports = {
  required: (name, args) => `${name} is required`,
  'String.min': (name, args) => `${name} must be at least ${args.min} characters long`,
  'String.max': (name, args) => `${name} must be less than or equal to ${args.max} characters long`
};
