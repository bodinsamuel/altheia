module.exports = {
  required: name => `${name} is required`,

  'string.typeof': name => `${name} must be a valid string`,
  'string.min': (name, args) => `${name} must be at least ${args.min} characters long`,
  'string.max': (name, args) => `${name} must be at most ${args.max} characters long`,
  'string.pattern': (name, args) => `${name} must match pattern "${args.regex}"`,
  'string.in': (name, args) => `${name} must be one of [${args.obj}]`,
  'string.not': name => `${name} contains forbidden value`,
  'string.email': name => `${name} must be a valid email`,
  'string.lowercase': name => `${name} must be lowercase only`,
  'string.uppercase': name => `${name} must be uppercase only`,

  'date.typeof': name => `${name} must be a valid date`,
  'date.iso': name => `${name} must be an ISO-8601 date`,

  'number.typeof': name => `${name} must be a valid number`,
  'number.min': (name, args) => `${name} must be at least ${args.min}`,
  'number.max': (name, args) => `${name} must be less than or equal to ${args.max}`,
  'number.integer': name => `${name} must be an integer`,
  'number.unsigned': name => `${name} must be an unsigned number`,
  'number.positive': name => `${name} must be a positive number`,
  'number.negative': name => `${name} must be a negative number`,

  'object.typeof': name => `${name} must be a valid object`,
  'object.in': (name, args) => `${name} must only contains these keys [${args.in}]`,
  'object.not': name => `${name} contains forbidden value`,

  'array.typeof': name => `${name} must be a valid array`,
  'array.min': (name, args) => `${name} must contains at least ${args.min} items`,
  'array.max': (name, args) => `${name} must contains at most ${args.max} items`,
  'array.in': (name, args) => `${name} must only contains these keys [${args.in}]`,
  'array.not': name => `${name} contains forbidden value`
};
