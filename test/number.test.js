const Alt = require('./../src');

describe('Number', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().validate(1);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.number().validate(1.1);
      expect(hasError).toBe(false);
    });
    test('should not pass: string', async () => {
      const hasError = await Alt.number().validate('1');
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.typeof',
        message: 'value must be a valid number',
      });
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.number().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.number().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.number().validate({});
      expect(hasError).toBeTruthy();
    });
    test('should not pass: NaN', async () => {
      const hasError = await Alt.number().validate(NaN);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: infinity', async () => {
      const hasError = await Alt.number().validate(Infinity);
      expect(hasError).toBeTruthy();
    });
  });

  describe('cast()', () => {
    test('should pass: string', async () => {
      const hasError = await Alt.number()
        .cast()
        .validate('1');
      expect(hasError).toBe(false);
    });
    test('should not pass: string', async () => {
      const hasError = await Alt.number()
        .cast()
        .validate('foobar');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.number()
        .cast()
        .validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .min(2)
        .validate(2);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.number()
        .min(2)
        .validate(3);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .min(2)
        .validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.min',
        message: 'value must be at least 2',
      });
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .max(20)
        .validate(20);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.number()
        .max(20)
        .validate(18);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .max(20)
        .validate(21);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.max',
        message: 'value must be less than or equal to 20',
      });
    });
  });

  describe('integer()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .integer()
        .validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .integer()
        .validate(1.1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.integer',
        message: 'value must be an integer',
      });
    });
  });

  describe('unsigned()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .unsigned()
        .validate(0);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .unsigned()
        .validate(-1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.unsigned',
        message: 'value must be an unsigned number',
      });
    });
  });

  describe('positive()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .positive()
        .validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .positive()
        .validate(0);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.positive',
        message: 'value must be a positive number',
      });
    });
  });

  describe('negative()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .negative()
        .validate(-1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .negative()
        .validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.negative',
        message: 'value must be a negative number',
      });
    });
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .in(1)
        .validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .in(1, 2)
        .validate(3);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.in',
        message: 'value must be one of [1,2]',
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .not(1)
        .validate(2);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number()
        .not(1)
        .validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'number.not',
        message: 'value contains forbidden value',
      });
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number()
        .required()
        .validate(1);
      expect(hasError).toBe(false);
    });
    test('should pass: 0', async () => {
      const hasError = await Alt.number()
        .required()
        .validate(0);
      expect(hasError).toBe(false);
    });
    test('should pass: -1', async () => {
      const hasError = await Alt.number()
        .required()
        .validate(-1);
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.number()
        .required()
        .validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.number()
        .required()
        .validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.number()
        .required()
        .validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.number()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
