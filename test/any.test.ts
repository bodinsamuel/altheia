import Alt from '../src';

describe('Any', () => {
  describe('chaining', () => {
    test('should pass', async () => {
      const hasError = await Alt.any().required().validate(true);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.any().required().validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.any().required().validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
