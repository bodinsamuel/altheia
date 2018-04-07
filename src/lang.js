module.exports = {
  required: (name) => `${name} is required`,
  confirm: (name, args) =>
    `${args.comparison} must be the same as ${args.initial}`,
};
