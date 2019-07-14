import {
  TestFunction,
  ValidatorInternalTest,
  ValidatorTestResult,
} from '../types/global';

/**
 * Return a test default object
 * @param  {string}  options.name      The name of the test
 * @param  {function}  options.func    The function to call
 * @param  {object}  options.args      The arguments to pass to the function
 * @return {object}                    The final test object
 */
export function createTest({
  type,
  func = () => false,
  args = {},
}: {
  type: string;
  func?: TestFunction;
  args?: any;
}): ValidatorInternalTest {
  return {
    type,
    func,
    args,
  };
}

export function createTestResult(
  test: ValidatorInternalTest,
  valid: boolean,
  result?: any
): ValidatorTestResult {
  return {
    ...test,
    valid,
    result,
  };
}
