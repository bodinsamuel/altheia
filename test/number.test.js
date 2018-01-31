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
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().min(2).validate(2);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.number().min(2).validate(3);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().min(2).validate(1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().max(20).validate(20);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.number().max(20).validate(18);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().max(20).validate(21);
      expect(hasError).toBeTruthy();
    });
  });

  describe('integer()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().integer().validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().integer().validate(1.1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('unsigned()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().unsigned().validate(0);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().unsigned().validate(-1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('positive()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().positive().validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().positive().validate(0);
      expect(hasError).toBeTruthy();
    });
  });

  describe('negative()', () => {
    test('should pass', async () => {
      const hasError = await Alt.number().negative().validate(-1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.number().negative().validate(1);
      expect(hasError).toBeTruthy();
    });
  });
});
