import Alt from './../src';

const timeoutSuccess = (mark) => {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mark.pass = true;
        resolve(true);
      }, 500);
    });
  };
};
const timeoutError = (mark) => {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mark.pass = true;
        resolve(false);
      }, 500);
    });
  };
};

describe('Base', () => {
  test('Should use with callback', async () => {
    let mark = false;
    await Alt.string().validate('foobar', (error) => {
      expect(error).toBe(false);
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  describe('test()', () => {
    test('should understand object response', async () => {
      const hasError = await Alt.string()
        .custom('mytest', () => {
          return { isValid: false, error: 'not_okay' };
        })
        .validate('foobar');

      // to avoid false positive we check the callback real use
      expect(hasError).toBeTruthy();
      expect(hasError.result.error).toEqual('not_okay');
    });
    test('should fail if result is string', async () => {
      let error;
      try {
        await Alt.string()
          .custom('dfd', () => {
            return 'nope';
          })
          .validate('foobar');
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(
          'test() should return a boolean or an object { isValid:boolean, error:string }'
        )
      );
    });
    test('should fail if not a valid object', async () => {
      let error;
      try {
        await Alt.string()
          .custom('dfd', () => {
            return { foo: 'bar' };
          })
          .validate('foobar');
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(
          'test() should return a boolean or an object { isValid:boolean, error:string }'
        )
      );
    });
  });

  describe('clone()', () => {
    test('should clone correctly', async () => {
      const original = Alt.number().required();
      const clone = original.clone().max(4);

      expect(original.tests.length).toBe(1);
      expect(clone.tests.length).toBe(2);

      const hasError1 = await clone.validate(1);
      const hasError2 = await clone.max(4).validate(10);

      expect(hasError1).toBe(false);
      expect(hasError2).toBeTruthy();
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.string()
        .required()
        .validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.string()
        .required()
        .validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.string()
        .required()
        .validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.string()
        .required()
        .validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.string()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });

  describe('if()', () => {
    test('should pass in then sync', async () => {
      let mark = false;
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.email(),
          then: (chain) =>
            chain.custom('my_if', () => {
              mark = true;
              return true;
            }),
          otherwise: (chain) => chain.min(2),
        })
        .validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark).toBe(true);
    });

    test('should pass in then async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.email(),
          then: (chain) => chain.custom('my_if', timeoutSuccess(mark)),
          otherwise: (chain) => chain.min(2),
        })
        .validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark.pass).toBe(true);
    });

    test('should fail in then sync', async () => {
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.email(),
          then: (chain) => chain.min(50),
          otherwise: (chain) => chain.min(2),
        })
        .validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.min');
    });

    test('should fail in then async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.email(),
          then: (chain) => chain.custom('my_if', timeoutError(mark)),
          otherwise: (chain) => chain.min(2),
        })
        .validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.custom.my_if');
      expect(mark.pass).toBe(true);
    });

    test('should pass in otherwise sync', async () => {
      let mark = false;
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.uppercase(),
          then: (chain) => chain.min(2),
          otherwise: (chain) =>
            chain.custom('my_if', () => {
              mark = true;
              return true;
            }),
        })
        .validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark).toBe(true);
    });
    test('should pass in otherwise async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.uppercase(),
          then: (chain) => chain.min(2),
          otherwise: (chain) => chain.custom('my_if', timeoutSuccess(mark)),
        })
        .validate('foo@bar');

      expect(hasError).toBe(false);
      expect(mark.pass).toBe(true);
    });

    test('should fail in otherwise sync', async () => {
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.uppercase(),
          then: (chain) => chain.min(2),
          otherwise: (chain) => chain.max(3),
        })
        .validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.max');
    });

    test('should fail in otherwise async', async () => {
      const mark = { pass: false };
      const hasError = await Alt.string()
        .if({
          test: (chain) => chain.uppercase(),
          then: (chain) => chain.min(2),
          otherwise: (chain) => chain.custom('my_if', timeoutError(mark)),
        })
        .validate('foo@bar');

      expect(hasError).toBeTruthy();
      expect(hasError.name).toBe('string.custom.my_if');
      expect(mark.pass).toBe(true);
    });
  });

  describe('test()', () => {
    test('should be reusable', async (done) => {
      const schema = Alt.string().in('hello');

      const hasError1 = await schema.validate('good morning');
      expect(hasError1.isValid).toBe(false);

      const hasError2 = await schema.validate('hello');
      expect(hasError2).toBe(false);
      expect(hasError1.isValid).toBe(false);

      done();
    });
  });
});
