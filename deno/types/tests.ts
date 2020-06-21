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

export type TestFunction = (
  params: any
) => Promise<TestFunctionReturn> | TestFunctionReturn;

export type TestFunctionReturn = boolean | ValidatorInternalTestResult;

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
