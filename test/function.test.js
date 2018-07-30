const Alt = require('./../src');

describe('Function', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.function().validate(() => true);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.function().validate(function() {
        return true;
      });
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.function().validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'function.typeof',
        message: 'value must be a valid function',
      });
    });
    test('should not pass: object', async () => {
      const hasError = await Alt.function().validate({});
      expect(hasError).toBeTruthy();
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.function().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: string', async () => {
      const hasError = await Alt.function().validate('{}');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.function()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
