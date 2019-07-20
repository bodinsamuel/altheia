import { LangList } from './types';

const messages: LangList = {
  forbidden: (name: string) => `${name} is not allowed`,
  required: (name: string) => `${name} is required`,
  confirm: (_name: string, args) =>
    `${args.comparison} must be the same as ${args.initial}`,
};

export default messages;
