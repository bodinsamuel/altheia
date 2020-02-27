import Alt from '../src';
import { ValidatorErrorFormatted } from '../src/types';

describe('All', () => {
  test('should pass', async () => {
    const hasError = await Alt({
      foo: Alt.string(),
      number: Alt.number(),
      bool: Alt.boolean(),
      array: Alt.array(),
      function: Alt.function(),
      date: Alt.date(),
      internetUrl: Alt.internet().url(),
      object: Alt.object(),
      arrayWithTemplate: Alt.array().oneOf(Alt.string()),
      arrayWithTemplates: Alt.array().oneOf(Alt.string(), Alt.number()),
    })
      .body({
        foo: 'bar',
        number: 1,
        bool: true,
        array: [],
        function: () => true,
        date: new Date(),
        internetUrl: 'http://localhost/',
        object: { foo: 'bar' },
        arrayWithTemplate: ['foo'],
        arrayWithTemplates: ['foo', 1],
      })
      .validate();
    expect(hasError).toBe(false);
  });

  test('should fail', async () => {
    const hasError = await Alt({
      foo: Alt.string(),
      number: Alt.number(),
      bool: Alt.boolean(),
      array: Alt.array(),
      function: Alt.function(),
      date: Alt.date(),
      internetUrl: Alt.internet().url(),
      object: Alt.object(),
      arrayWithTemplate: Alt.array().oneOf(Alt.string()),
      arrayWithTemplates: Alt.array().oneOf(Alt.string(), Alt.number()),
    })
      .body({
        foo: 1,
        number: 'bar',
        bool: [],
        array: 'foo',
        function: new Date(),
        date: () => true,
        internetUrl: 1,
        object: [],
        arrayWithTemplate: [1],
        arrayWithTemplates: [true, {}],
      })
      .validate();
    expect(hasError).toHaveLength(10);
    expect(hasError).toMatchSnapshot();
  });

  test('should fail nested', async () => {
    const hasError = await Alt({
      foo: Alt.array().oneOf(Alt.string()),
      object: Alt.object().schema(
        Alt({
          bar: Alt.string(),
        })
      ),
      nested: Alt.array().oneOf(
        Alt.object().schema(
          Alt({
            foo: Alt.string(),
            nested2: Alt.array().oneOf(
              Alt.object().schema(
                Alt({ hello: Alt.string().in('nice') }).options({
                  required: true,
                })
              ),
              Alt.object().schema(
                Alt({ bonjour: Alt.string().in('cool') }).options({
                  required: true,
                })
              )
            ),
          }).options({ required: true })
        )
      ),
    })
      .body({
        foo: [1, 'foo', 'b', [], 'ar'],
        object: { bar: 1 },
        nested: [
          {
            foo: 'bar',
            nested2: [{ hello: 'nice' }, { hello: 2 }, { bonjour: 2 }],
          },
          {
            foo: 'bar',
            nested2: [{ hello: 'nice' }],
          },
        ],
      })
      .validate();
    expect(hasError).toHaveLength(3);
    expect(hasError).toMatchSnapshot();

    expect((hasError as ValidatorErrorFormatted[])[2].label).toBe('nested');
    expect((hasError as ValidatorErrorFormatted[])[2].errors[0].label).toBe(
      'item'
    );
    expect(
      (hasError as ValidatorErrorFormatted[])[2].errors[0].errors[0].label
    ).toBe('nested2');
    expect(
      (hasError as ValidatorErrorFormatted[])[2].errors[0].errors[0].errors[0]
        .label
    ).toBe('item');
    expect(
      (hasError as ValidatorErrorFormatted[])[2].errors[0].errors[0].errors[0]
        .position
    ).toBe(1);
  });
});
