import { LangList } from './types/lang';

const messages: LangList = {
  forbidden: (name: string): string => `${name} is not allowed`,
  required: (name: string): string => `${name} is required`,
  confirm: (_name: string, args): string =>
    `${args.comparison} must be the same as ${args.initial}`,
};

export default messages;
