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
        message: 'value must be a valid object',
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
      const hasError = await Alt.object()
        .in('foobar')
        .validate({ foobar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object()
        .in('foo', 'bar')
        .validate({ foo: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object()
        .in('foo', 'bar')
        .validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object()
        .in(['foo', 'bar'])
        .validate({ foo: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .in('foobar')
        .validate({ barfoo: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .in('foobar')
        .validate({ barfoo: 1, foobar: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .in('foo', 'bar')
        .validate({ foo: 1, alice: 1 });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.in',
        message: 'value must only contains these keys [foo,bar]',
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object()
        .not('foobar')
        .validate({ barfoo: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object()
        .not('foo', 'bar')
        .validate({ oof: 1 });
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.object()
        .not(['foo'])
        .validate({ oof: 1, bar: 1 });
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .not('foobar')
        .validate({ foobar: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .not('foobar')
        .validate({ barfoo: 1, foobar: 1 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass', async () => {
      const hasError = await Alt.object()
        .not('foo', 'bar')
        .validate({ foo: 1, alice: 1 });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.not',
        message: 'value contains forbidden value',
      });
    });
  });

  describe('schema', () => {
    test('should pass', async () => {
      const hasError = await Alt.object()
        .schema({
          schema: Alt({
            foo: Alt.string(),
          }).options({ required: true }),
        })
        .validate({ foo: 'bar' });
      expect(hasError).toBe(false);
    });

    test('should pass (new api)', async () => {
      const hasError = await Alt.object()
        .schema(
          Alt({
            foo: Alt.string(),
          }).options({ required: true })
        )
        .validate({ foo: 'bar' });
      expect(hasError).toBe(false);
    });

    test('should fail', async () => {
      const hasError = await Alt.object()
        .schema({
          schema: Alt({
            foo: Alt.number(),
          }).options({ required: true }),
        })
        .validate({ foo: 'bar' });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.schema',
        message: 'value has not a valid schema',
      });
    });

    test('should fail not valid schema', async () => {
      expect(() => {
        Alt.object().schema({
          schema: {},
        });
      }).toThrow();
    });

    test('should fail deep', async () => {
      const hasError = await Alt({
        data: Alt.object().schema({
          schema: Alt({
            foo: Alt.number(),
          }).options({ required: true }),
          returnErrors: true,
        }),
      })
        .body({ data: { foo: 'bar' } })
        .validate();
      expect(hasError).toBeTruthy();
      expect(hasError).toEqual([
        {
          label: 'data',
          type: 'object.schema',
          message: 'data has not a valid schema',
          errors: [
            {
              label: 'foo',
              message: 'foo must be a valid number',
              type: 'number.typeof',
            },
          ],
        },
      ]);
    });

    test('should fail deep (new api)', async () => {
      const hasError = await Alt({
        data: Alt.object().schema(
          Alt({
            foo: Alt.number(),
          }).options({ required: true }),
          {
            returnErrors: true,
          }
        ),
      })
        .body({ data: { foo: 'bar' } })
        .validate();
      expect(hasError).toBeTruthy();
      expect(hasError).toEqual([
        {
          label: 'data',
          type: 'object.schema',
          message: 'data has not a valid schema',
          errors: [
            {
              label: 'foo',
              message: 'foo must be a valid number',
              type: 'number.typeof',
            },
          ],
        },
      ]);
    });

    test('should fail bad parameter schema', async () => {
      expect(() => {
        Alt.object().schema(new Error());
      }).toThrow(
        'schema should be an instance of altheia validator "Alt({ ... })" or a plain object'
      );
    });

    test('should pass, plain object', async () => {
      const hasError = await Alt({
        data: Alt.object().schema({
          foo: Alt.number(),
        }),
      })
        .body({ data: { foo: 1 } })
        .validate();
      expect(hasError).toBe(false);
    });
  });

  describe('oneOf()', () => {
    test('should pass: a', async () => {
      const hasError = await Alt.object()
        .oneOf('a', 'b')
        .validate({ a: 1 });
      expect(hasError).toBe(false);
    });

    test('should pass: b', async () => {
      const hasError = await Alt.object()
        .oneOf('a', 'b')
        .validate({ b: 1 });
      expect(hasError).toBe(false);
    });

    test('should pass: a b d e f j...', async () => {
      const hasError = await Alt.object()
        .oneOf('a', 'b', 'c', 'd', 'e', 'f')
        .validate({ d: 1 });
      expect(hasError).toBe(false);
    });

    test('should not pass: both presents', async () => {
      const hasError = await Alt.object()
        .oneOf('a', 'b')
        .validate({ a: 1, b: 1 });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.oneOf',
        message: 'value can not contain these two keys [a,b] at the same time',
      });
    });

    test('should pass: none presents, without flag', async () => {
      const hasError = await Alt.object()
        .oneOf('a', 'b')
        .validate({});
      expect(hasError).toBe(false);
    });

    test('should not pass: none presents, with flag', async () => {
      const hasError = await Alt.object()
        .oneOf(true, 'a', 'b')
        .validate({});
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.oneOf',
        message: 'value must contain one of these keys [a,b]',
      });
    });
  });

  describe('allOf()', () => {
    test('should pass: a, b, c', async () => {
      const hasError = await Alt.object()
        .allOf('a', 'b', 'c')
        .validate({ a: 1, b: 2, c: 3 });
      expect(hasError).toBe(false);
    });
    test('should not pass: a,  c', async () => {
      const hasError = await Alt.object()
        .allOf('a', 'b', 'c')
        .validate({ a: 1, c: 3 });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: none', async () => {
      const hasError = await Alt.object()
        .allOf('a', 'b', 'c')
        .validate({ z: 1 });
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'object.allOf',
        message: 'value must contain either none or all of these keys [a,b,c]',
      });
    });
  });

  describe('required()', () => {
    test('should pass', async () => {
      const hasError = await Alt.object()
        .required()
        .validate({});
      expect(hasError).toBe(false);
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.object()
        .required()
        .validate();
      expect(hasError).toBeTruthy();
    });
    test('should not pass: null', async () => {
      const hasError = await Alt.object()
        .required()
        .validate(null);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: empty string', async () => {
      const hasError = await Alt.object()
        .required()
        .validate('');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: undefined', async () => {
      const hasError = await Alt.object()
        .required()
        .validate(undefined);
      expect(hasError).toBeTruthy();
    });
  });
});
