const Alt = require('./../src');

describe('All', () => {
  // test('should pass', async () => {
  //   const hasError = await Alt({
  //     foo: Alt.string(),
  //     number: Alt.number(),
  //     bool: Alt.boolean(),
  //     array: Alt.array(),
  //     function: Alt.function(),
  //     date: Alt.date(),
  //     internetUrl: Alt.internet().url(),
  //     object: Alt.object()
  //   }).body({
  //     foo: 'bar',
  //     number: 1,
  //     bool: true,
  //     array: [],
  //     function: () => true,
  //     date: new Date(),
  //     internetUrl: 'http://localhost/',
  //     object: { foo: 'bar' }
  //   }).validate();
  //   expect(hasError).toBe(false);
  // });

  // test('should fail', async () => {
  //   const hasError = await Alt({
  //     foo: Alt.string(),
  //     number: Alt.number(),
  //     bool: Alt.boolean(),
  //     array: Alt.array(),
  //     function: Alt.function(),
  //     date: Alt.date(),
  //     internetUrl: Alt.internet().url(),
  //     object: Alt.object()
  //   }).body({
  //     foo: 1,
  //     number: 'bar',
  //     bool: [],
  //     array: 'foo',
  //     function: new Date(),
  //     date: () => true,
  //     internetUrl: 1,
  //     object: []
  //   }).validate();
  //   expect(hasError).toHaveLength(8);
  //   expect(hasError).toMatchSnapshot();
  // });

  test('should fail nested', async () => {
    const hasError = await Alt({
      // foo: Alt.array().oneOf(Alt.string()),
      // object: Alt.object().schema(Alt({
      //   bar: Alt.string()
      // })),
      nested: Alt.array().oneOf(
        Alt.object().schema(
          Alt({
            foo: Alt.string(),
            nested2: Alt.array().oneOf(
              Alt.object().schema(
                Alt({ hello: Alt.string().in('nice') }).options({
                  unknown: false,
                  required: true,
                })
              ),
              Alt.object().schema(
                Alt({ bonjour: Alt.string().in('cool') }).options({
                  unknown: false,
                  required: true,
                })
              )
            ),
          }).options({ unknown: false, required: true })
        ),
      ),
    })
      .body({
        // foo: [1, 'foo', 'b', [], 'ar'],
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
    expect(hasError).toHaveLength(1);
    expect(hasError).toMatchSnapshot();
  });
});
