const Alt = require('./../src');

describe('String', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array().validate([]);
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.array().validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.typeof',
        message: 'value must be a valid array'
      });
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.array().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.array().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.array().validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().min(2).validate([1, 2, 3]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().min(2).validate([1]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.min',
        message: 'value must contains at least 2 items'
      });
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().max(2).validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().max(2).validate([1, 2, 3, 4]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.max',
        message: 'value must contains at most 2 items'
      });
    });
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().in(1, 2).validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array().in([1, 2]).validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().in(1, 2).validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.in',
        message: 'value must only contains these keys [1,2]'
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().not(3).validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array().not(3, 5, 6).validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().not(3).validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value'
      });
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().not([1, 2, 3]).validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value'
      });
    });
    test('should not pass', async () => {
      const hasError = await Alt.array().not(3, 4, 5).validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value'
      });
    });
  });
});
