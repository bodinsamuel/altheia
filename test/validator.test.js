const Alt = require('./../src');
const Validator = require('./../src/validator');

describe('Validator', () => {
  test('Should be a func', async () => {
    expect(Alt).toBeInstanceOf(Function);
  });

  test('Should validate with callback', async () => {
    let mark = false;
    const result = await Alt({ foo: Alt.number() }).body({ foo: 1 }).validate((error) => {
      expect(error).toBe(false);
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  test('Should validate with callback and error', async () => {
    let mark = false;
    const result = await Alt({ foo: Alt.string() }).body({ foo: 1 }).validate((error) => {
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

  test('Should validate with error', async () => {
    const result = await Alt({ foo: Alt.string() }).body({ foo: 1 }).validate()
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

    describe('required', () => {
      test('should fail', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string(),
          password: Alt.string()
        }).body({
          name: 'top'
        }).options({
          required: true
        }).validate();

        expect(hasError).toBeTruthy();
        expect(hasError).toEqual([{
          label: 'login',
          message: 'login is required',
          type: 'required'
        }, {
          label: 'password',
          message: 'password is required',
          type: 'required'
        }]);
      });

      test('should pass', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({
          name: 'top'
        }).options({
          required: false
        }).validate();

        expect(hasError).toBe(false);
      });

      test('should fail with empty', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({}).options({
          required: true
        }).validate();

        expect(hasError).toBeTruthy();
      });
    });

    describe('unknown', () => {
      test('should fail', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({
          name: 'top',
          foo: 'bar'
        }).options({
          unknown: false
        }).validate();

        expect(hasError).toBeTruthy();
        expect(hasError).toEqual([{
          label: 'schema',
          message: 'schema must only contains these keys [name,login]',
          type: 'object.in'
        }]);
      });

      test('should pass', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({
          name: 'top',
          login: 'bar'
        }).options({
          unknown: false
        }).validate();

        expect(hasError).toBe(false);
      });

      test('should pass with empty', async () => {
        const hasError = await Alt({
          name: Alt.string(),
          login: Alt.string()
        }).body({}).options({
          unknown: false,
          required: false
        }).validate();

        expect(hasError).toBe(false);
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
      }).body({ login: 'foobA', password: 'foob' }).validate();
      expect(hasError).toBeTruthy();
      expect(hasError.length).toBe(2);

      expect(hasError[0]).toEqual({
        label: 'login',
        type: 'string.min',
        message: 'login must be at least 6 characters long'
      });
      expect(hasError[1]).toEqual({
        label: 'password',
        type: 'string.min',
        message: 'password must be at least 10 characters long'
      });
    });
  });

  describe('custom()', () => {
    test('Should use custom message', async () => {
      Alt.lang('string.custom.sync', () => 'foobar');

      const hasError = await Alt({
        login: Alt.string().custom('sync', (value) => {
          return value === 'barfoor';
        })
      }).body({ login: 'foobar' }).validate();

      expect(hasError).toBeTruthy();
      expect(hasError[0].message).toBe('foobar');
    });

    test('Should validate sync', async () => {
      const hasError = await Alt({
        login: Alt.string().custom('sync', (value) => {
          return value === 'foobar';
        })
      }).body({ login: 'foobar' }).validate();
      expect(hasError).toBe(false);
    });

    test('Should not validate sync', async () => {
      const hasError = await Alt({
        login: Alt.string().custom('sync', (value) => {
          return value === 'barfoor';
        })
      }).body({ login: 'foobar' }).validate();
      expect(hasError).toBeTruthy();
    });

    test('Should validate async', async () => {
      let mark = false;
      const hasError = await Alt({
        login: Alt.string().custom('sync', (value) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              mark = true;
              resolve();
            }, 500);
          });
        })
      }).body({ login: 'foobar' }).validate();

      expect(hasError).toBe(false);
      expect(mark).toBe(true);
    });

    test('Should not validate async', async () => {
      let mark = false;
      const hasError = await Alt({
        login: Alt.string().custom('sync', (value) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              mark = true;
              reject();
            }, 500);
          });
        })
      }).body({ login: 'foobar' }).validate();

      expect(hasError).toBeTruthy();
      expect(mark).toBe(true);
    });
  });

  describe('confirm()', () => {
    test('Should confirm correctly', async () => {
      const hasError = await Alt({
        login: Alt.string(),
        relogin: Alt.string()
      }).body({ login: 'foobar', relogin: 'foobar' })
        .confirm('login', 'relogin').validate();
      expect(hasError).toBe(false);
    });
    test('Should fail on confirm', async () => {
      const hasError = await Alt({
        login: Alt.string(),
        relogin: Alt.string()
      }).body({ login: 'foobar', relogin: 'barfoo' })
        .confirm('login', 'relogin').validate();

      expect(hasError).toBeTruthy();
    });
  });
});
