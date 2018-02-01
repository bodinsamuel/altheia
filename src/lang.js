module.exports = {
  required: (name, args) => `${name} is required`,

  'string.typeof': (name, args) => `${name} must be a valid string`,
  'string.min': (name, args) => `${name} must be at least ${args.min} characters long`,
  'string.max': (name, args) => `${name} must be less than or equal to ${args.max} characters long`,
  'string.pattern': (name, args) => `${name} must match pattern "${args.regex}"`,
  'string.in': (name, args) => `${name} must be one of [${args.obj}]`,
  'string.not': (name, args) => `${name} contains forbidden value`,
  'string.email': (name, args) => `${name} must be a valid email`,
  'string.lowercase': (name, args) => `${name} must be lowercase only`,
  'string.uppercase': (name, args) => `${name} must be uppercase only`,

  'date.typeof': (name, args) => `${name} must be a valid date`,
  'date.iso': (name, args) => `${name} must be an ISO-8601 date`,

  'number.typeof': (name, args) => `${name} must be a valid number`,
  'number.min': (name, args) => `${name} must be at least ${args.min}`,
  'number.max': (name, args) => `${name} must be less than or equal to ${args.max}`,
  'number.integer': (name, args) => `${name} must be an integer`,
  'number.unsigned': (name, args) => `${name} must be an unsigned number`,
  'number.positive': (name, args) => `${name} must be a positive number`,
  'number.negative': (name, args) => `${name} must be a negative number`,

  'object.typeof': (name, args) => `${name} must be a valid object`,
  'object.in': (name, args) => `${name} must only contains these keys [${args.in}]`
};
