/* eslint-disable no-use-before-define */
export type TestFunctionReturn = boolean | ValidatorInternalTestResult;

export type TestFunction = (
  params: any
) => Promise<TestFunctionReturn> | TestFunctionReturn;

export interface ValidatorTestResult {
  valid: boolean;
  type: string;
  func: TestFunction;
  args: any;
  result?: ValidatorInternalTestResult;
}

export interface ValidatorErrorRaw {
  test: ValidatorTestResult;
  label: string;
  position?: number;
}

export interface ValidatorErrorFormatted {
  label: string;
  type: string;
  message: string;
  position?: number;
  errors?: ValidatorErrorFormatted[];
}

// ---------- Tests Private
export interface ValidatorInternalTest {
  type: string;
  func: TestFunction;
  args: any;
}

export interface ValidatorInternalTestResult {
  valid: boolean;
  error: string;
  overrideWith?: ValidatorTestResult;
  errors?: ValidatorErrorRaw[];
  [key: string]: any;
}
