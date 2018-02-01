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
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.typeof',
        message: 'value must be a valid object'
      });
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
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object().in('foobar').validate({ foobar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().in('foo', 'bar').validate({ foo: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().in('foo', 'bar').validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object().in(['foo', 'bar']).validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().in('foobar').validate({ barfoo: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().in('foobar').validate({ barfoo: 1, foobar: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object().in('foo', 'bar').validate({ foo: 1, alice: 1 });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.in',
        message: 'value must only contains these keys [foo,bar]'
      });
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object().required().validate({});
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.object().required().validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.object().required().validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.object().required().validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.object().required().validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
