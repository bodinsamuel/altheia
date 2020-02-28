export type LangFunction = (name: string, args?: any, result?: any) => string;

export interface LangList {
  [k: string]: LangFunction;
}
