const Alt = require('./../src');

const timeoutSuccess = (mark) => {
  return (value) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        mark.pass = true;
        resolve(true);
      }, 500);
    });
  };
};
const timeoutError = (mark) => {
  return (value) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        mark.pass = true;
        resolve(false);
      }, 500);
    });
  };
};


describe('Base', () => {
  test('Should validate with callback', async () => {
    let mark = false;
    const result = await Alt.string().validate('foobar', (error) => {
      expect(error).toBe(false);
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string().required().validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.string().required().validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.string().required().validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.string().required().validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.string().required().validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });

  describe('if()', () => {
    test('should pass in then sync', async () => {
      let mark = false;
      const hasError = await Alt.string().if({
        test: chain => chain.email(),
        then: chain => chain.custom('my_if', (val) => {
          mark = true;
          return true;
        }),
        otherwise: chain => chain.min(2)
      }).validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark).toBe(true);
    });

    test('should pass in then async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string().if({
        test: chain => chain.email(),
        then: chain => chain.custom('my_if', timeoutSuccess(mark)),
        otherwise: chain => chain.min(2)
      }).validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark.pass).toBe(true);
    });

    test('should fail in then sync', async () => {
      const hasError = await Alt.string().if({
        test: chain => chain.email(),
        then: chain => chain.min(50),
        otherwise: chain => chain.min(2)
      }).validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.min');
    });

    test('should fail in then async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string().if({
        test: chain => chain.email(),
        then: chain => chain.custom('my_if', timeoutError(mark)),
        otherwise: chain => chain.min(2)
      }).validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.custom.my_if');
      expect(mark.pass).toBe(true);
    });

    test('should pass in otherwise sync', async () => {
      let mark = false;
      const hasError = await Alt.string().if({
        test: chain => chain.uppercase(),
        then: chain => chain.min(2),
        otherwise: chain => chain.custom('my_if', (val) => {
          mark = true;
          return true;
        })
      }).validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark).toBe(true);
    });
    test('should pass in otherwise async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string().if({
        test: chain => chain.uppercase(),
        then: chain => chain.min(2),
        otherwise: chain => chain.custom('my_if', timeoutSuccess(mark))
      }).validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark.pass).toBe(true);
    });

    test('should fail in otherwise sync', async () => {
      const hasError = await Alt.string().if({
        test: chain => chain.uppercase(),
        then: chain => chain.min(2),
        otherwise: chain => chain.max(3)
      }).validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.max');
    });

    test('should fail in otherwise async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string().if({
        test: chain => chain.uppercase(),
        then: chain => chain.min(2),
        otherwise: chain => chain.custom('my_if', timeoutError(mark))
      }).validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.custom.my_if');
      expect(mark.pass).toBe(true);
    });
  });
});
