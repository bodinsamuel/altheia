import Alt from '../src';
import { ValidatorTestResult } from '../src/typings/tests';

describe('Date', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date().validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date().validate(new Date('2017-05-15'));
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date().validate('2017-05-15T08:30:00');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date().validate('1');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date().validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.date().validate(true);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'date.typeof',
        message: 'value must be a valid date',
      });
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.date().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.date().validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('iso()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date()
        .iso()
        .validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date()
        .iso()
        .validate('2017-05-15T08:30:00');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.date()
        .iso()
        .validate('1');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'date.iso',
        message: 'value must be an ISO-8601 date',
      });
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date()
        .min(new Date('2016-05-15'))
        .validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.date()
        .min(new Date('2018-05-15'))
        .validate('2017-05-15');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'date.min',
        message: 'value must be at least 2018-05-15T00:00:00.000Z',
      });
    });
    test('should not pass invalid date', async () => {
      const hasError = await Alt.date()
        // @ts-ignore
        .min('2016-05-15')
        .validate('2017-05-15');
      expect(hasError).toBeTruthy();
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date()
        .max(new Date('2018-05-15'))
        .validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.date()
        .max(new Date('2016-05-15'))
        .validate('2017-05-15');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'date.max',
        message: 'value must be less than or equal to 2016-05-15T00:00:00.000Z',
      });
    });
    test('should not pass invalid date', async () => {
      const hasError = await Alt.date()
        // @ts-ignore
        .max('2018-05-15')
        .validate('2017-05-15');
      expect(hasError).toBeTruthy();
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date()
        .required()
        .validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.date()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.date()
        .required()
        .validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.date()
        .required()
        .validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.date()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
