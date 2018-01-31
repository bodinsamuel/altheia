const Alt = require('./../src');

describe('Object', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object().validate({});
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.object().validate(1);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.object().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.object().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: string', async () => {
      const hasError = await Alt.object().validate('{}');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.object().validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });

  describe('only()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object().only('foobar').validate({ foobar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().only('foo', 'bar').validate({ foo: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().only('foo', 'bar').validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().only(['foo', 'bar']).validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().only('foobar').validate({ barfoo: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().only('foobar').validate({ barfoo: 1, foobar: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().only('foo', 'bar').validate({ foo: 1, alice: 1 });
      expect(hasError).toBeTruthy();
    });
  });
});
