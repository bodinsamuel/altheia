const Alt = require('./../src');

describe('String', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string().validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.string().validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.typeof',
        message: 'value must be a valid string',
      });
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.string().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.string().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.string().validate({});
      expect(hasError).toBeTruthy();
    });
    test('should pass: empty string', async () => {
      const hasError = await Alt.string().validate('');
      expect(hasError).toBe(false);
    });
    test('should not pass: empty string with flag', async () => {
      const hasError = await Alt.string()
        .noEmpty()
        .validate('');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.empty',
        message: 'value can not be empty',
      });
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .min(2)
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .min(2)
        .validate('a');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.min',
        message: 'value must be at least 2 characters long',
      });
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .max(2)
        .validate('a');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .max(2)
        .validate('foobar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.max',
        message: 'value must be at most 2 characters long',
      });
    });
  });

  describe('pattern()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .pattern(/^[a-z]+$/)
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .pattern(/^[a-z]+$/)
        .validate('f00bar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.pattern',
        message: 'value must match pattern "/^[a-z]+$/"',
      });
    });
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .in('foobar')
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .in('barfoo', 'top')
        .validate('foobar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.in',
        message: 'value must be one of [barfoo,top]',
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .not('barfoo')
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .not('foobar')
        .validate('foobar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.not',
        message: 'value contains forbidden value',
      });
    });
  });

  describe('email()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .email()
        .validate('foo@bar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .email()
        .validate('foobar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.email',
        message: 'value must be a valid email',
      });
    });
  });

  describe('lowercase()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .lowercase()
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .lowercase()
        .validate('fooBar');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.lowercase',
        message: 'value must be lowercase only',
      });
    });
  });

  describe('uppercase()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .uppercase()
        .validate('FOOBAR');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.string()
        .uppercase()
        .validate('FOObAR');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'string.uppercase',
        message: 'value must be uppercase only',
      });
    });
  });
});
