const Alt = require('./../src');

describe('Date', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date().validate('2017-05-15');
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
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'date.typeof',
        message: 'value must be a valid date'
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
      const hasError = await Alt.date().iso().validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.date().iso().validate('2017-05-15T08:30:00');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.date().iso().validate('1');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'date.iso',
        message: 'value must be an ISO-8601 date'
      });
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.date().required().validate('2017-05-15');
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.date().required().validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.date().required().validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.date().required().validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.date().required().validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
