const Alt = require('./../src');
const Validator = require('./../src/validator');

describe('Validator', () => {
  test('Should be a func', async () => {
    expect(Alt).toBeInstanceOf(Function);
  });

  test('Should validate with callback', async () => {
    let mark = false;
    const result = await Alt.string().validate('foobar', (error) => {
      expect(error).toBe(false);
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  test('Should validate with callback and error', async () => {
    let mark = false;
    const result = await Alt.string().validate(1, (error) => {
      expect(error).toBeTruthy();
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  test('Should validate with await', async () => {
    const result = await Alt.string().validate('foobar');
    expect(result).toBe(false);
  });

  test('Should validate with callback and error', async () => {
    const result = await Alt.string().validate(1);
    expect(result).toBeTruthy();
  });

  describe('schema()', () => {
    test('should pass', async () => {
      const instance = Alt({ foo: Alt.string() });
      expect(instance).toBeInstanceOf(Validator);
    });
    test('should throw error on bad params', async () => {
      expect(() => {
        Alt(true);
      }).toThrow('schema should be object');
    });
  });

  describe('options()', () => {
    test('should throw error on bad params', async () => {
      expect(() => {
        Alt({}).options(true);
      }).toThrow('schema should be object');
    });

    describe('unknown', () => {
      test('should failed', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({
          name: 'top',
          foo: 'bar'
        }).options({
          unknown: false
        }).validate();

        expect(hasError).toEqual({ type: 'only' });
      });
    });
  });

  describe('validate()', () => {
    test('Should validate simple schema', async () => {
      const hasError = await Alt({
        login: Alt.string()
      }).body({ login: 'foobar' }).validate();
      expect(hasError).toBe(false);
    });
    test('Should not pass simple schema', async () => {
      const hasError = await Alt({
        login: Alt.string()
      }).body({ login: 1 }).validate();
      expect(hasError).toBeTruthy();
    });

    test('Should pass mid-complexe schema', async () => {
      const hasError = await Alt({
        login: Alt.string().min(6).max(15).pattern(/[a-z]+/),
        password: Alt.string().min(10)
      }).body({ login: 'foobar', password: 'foobarfoobar' }).validate();
      expect(hasError).toBe(false);
    });

    test('Should not pass mid-complexe schema', async () => {
      const hasError = await Alt({
        login: Alt.string().min(6).max(15).pattern(/^[a-z]+$/),
        password: Alt.string().min(10)
      }).body({ login: 'foobAr', password: 'foob' }).validate();
      expect(hasError).toBeTruthy();
    });
  });
});
