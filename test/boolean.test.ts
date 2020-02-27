import Alt from '../src';
import { ValidatorTestResult } from '../src/typings/tests';

describe('Boolean', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.boolean().validate(true);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.boolean().validate(false);
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.boolean().validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'boolean.typeof',
        message: 'value must be a valid boolean',
      });
    });
    test('should not pass: object', async () => {
      const hasError = await Alt.boolean().validate({});
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.boolean().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: string', async () => {
      const hasError = await Alt.boolean().validate('{}');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.boolean()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });

  describe('cast()', () => {
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .cast()
        .validate('false');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .cast()
        .validate('False');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .cast()
        .validate('true');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .cast()
        .validate('True');
      expect(hasError).toBe(false);
    });
    test('should not pass: object', async () => {
      const hasError = await Alt.boolean()
        .cast()
        .validate({});
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.boolean()
        .required()
        .cast()
        .validate('');
      expect(hasError).toBeTruthy();
    });
  });

  describe('false()', () => {
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .false()
        .validate(false);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.boolean()
        .false()
        .validate(true);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'boolean.false',
        message: 'value must be false',
      });
    });
  });

  describe('true()', () => {
    test('should not pass', async () => {
      const hasError = await Alt.boolean()
        .true()
        .validate(true);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.boolean()
        .true()
        .validate(false);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'boolean.true',
        message: 'value must be true',
      });
    });
  });
});
