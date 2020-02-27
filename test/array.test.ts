import Alt from '../src';
import { ValidatorTestResult } from '../src/types';

describe('String', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array().validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array().validate([]);
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Alt.array().validate(1);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.typeof',
        message: 'value must be a valid array',
      });
    });
    test('should not pass: boolean', async () => {
      const hasError = await Alt.array().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Alt.array().validate(() => {
        return 1;
      });
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Alt.array().validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .min(2)
        .validate([1, 2, 3]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .min(2)
        .validate([1]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.min',
        message: 'value must contains at least 2 items',
      });
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .max(2)
        .validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .max(2)
        .validate([1, 2, 3, 4]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.max',
        message: 'value must contains at most 2 items',
      });
    });
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .in(1, 2)
        .validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array()
        .in([1, 2])
        .validate([1, 2]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .in(1, 2)
        .validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.in',
        message: 'value must only contains these keys [1,2]',
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .not(3)
        .validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Alt.array()
        .not(3, 5, 6)
        .validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .not(3)
        .validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value',
      });
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .not([1, 2, 3])
        .validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value',
      });
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .not(3, 4, 5)
        .validate([1, 2, 3]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.not',
        message: 'value contains forbidden value',
      });
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .unique()
        .validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .unique()
        .validate([1, 2, 2]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.unique',
        message: 'value can not contains duplicated value',
      });
    });
  });

  describe('oneOf()', () => {
    test('should pass', async () => {
      const hasError = await Alt.array()
        .oneOf(Alt.number())
        .validate([1, 2, 4]);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Alt.array()
        .oneOf(Alt.string())
        .validate(['foo', 2, 'bar']);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.oneOf',
        message: 'value contains forbidden items',
        errors: [
          {
            label: 'item',
            message: 'item must be a valid string',
            position: 1,
            type: 'string.typeof',
          },
        ],
      });
    });

    test('should pass with multiple templates', async () => {
      const hasError = await Alt.array()
        .oneOf(Alt.number(), Alt.string())
        .validate([1, 2, 'foobar']);
      expect(hasError).toBe(false);
    });
    test('should not pass with multiple templates', async () => {
      const hasError = await Alt.array()
        .oneOf(Alt.number(), Alt.object())
        .validate([1, 2, 'foobar']);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.oneOf',
        message: 'value contains forbidden items',
        errors: [
          {
            label: 'item',
            message: 'item does not match any of the allowed types',
            position: 2,
            type: 'array.itemInvalid',
          },
        ],
      });
    });
    test('should not pass with multiple templates and complex date', async () => {
      const hasError = await Alt.array()
        .oneOf(
          Alt.number(),
          Alt.object().schema(
            Alt({
              foo: Alt.object().schema(
                Alt({
                  bar: Alt.string(),
                })
              ),
            })
          )
        )
        .validate([
          1,
          'foobar',
          { foo: { bar: '1' } },
          { foo: { bar: 1 } },
          { foo: { bar: '1' } },
        ]);
      expect(hasError).toBeTruthy();
      expect(Alt.formatError(hasError as ValidatorTestResult)).toEqual({
        label: 'value',
        type: 'array.oneOf',
        message: 'value contains forbidden items',
        errors: [
          {
            label: 'item',
            message: 'item does not match any of the allowed types',
            position: 1,
            type: 'array.itemInvalid',
          },
          {
            label: 'item',
            message: 'item does not match any of the allowed types',
            position: 3,
            type: 'array.itemInvalid',
          },
        ],
      });
    });
  });
});
