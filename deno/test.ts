import {
  assertEquals,
  assertNotEquals,
} from 'https://deno.land/std/testing/asserts.ts';

import Alt from './index.ts';

Deno.test('should pass', async () => {
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
  assertEquals(hasError, false);
});

Deno.test('should fail', async () => {
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
  assertNotEquals(hasError, false);
  assertEquals(hasError && hasError.length, 10);
  assertEquals(hasError, [
    {
      label: 'foo',
      type: 'string.typeof',
      message: 'foo must be a valid string',
    },
    {
      label: 'number',
      type: 'number.typeof',
      message: 'number must be a valid number',
    },
    {
      label: 'bool',
      type: 'boolean.typeof',
      message: 'bool must be a valid boolean',
    },
    {
      label: 'array',
      type: 'array.typeof',
      message: 'array must be a valid array',
    },
    {
      label: 'function',
      type: 'function.typeof',
      message: 'function must be a valid function',
    },
    {
      label: 'date',
      type: 'date.typeof',
      message: 'date must be a valid date',
    },
    {
      label: 'internetUrl',
      type: 'internet.typeof',
      message: 'internetUrl must be a valid string',
    },
    {
      label: 'object',
      type: 'object.typeof',
      message: 'object must be a valid object',
    },
    {
      label: 'arrayWithTemplate',
      type: 'array.oneOf',
      message: 'arrayWithTemplate contains forbidden items',
      errors: [
        {
          label: 'item',
          type: 'string.typeof',
          message: 'item must be a valid string',
          position: 0,
        },
      ],
    },
    {
      label: 'arrayWithTemplates',
      type: 'array.oneOf',
      message: 'arrayWithTemplates contains forbidden items',
      errors: [
        {
          label: 'item',
          type: 'array.itemInvalid',
          message: 'item does not match any of the allowed types',
          position: 0,
        },
        {
          label: 'item',
          type: 'array.itemInvalid',
          message: 'item does not match any of the allowed types',
          position: 1,
        },
      ],
    },
  ]);
});
