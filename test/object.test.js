const Api = require('./../src');

test('Object unknown should failed', async () => {
  const hasError = await Api({
    name: Api.string(),
    login: Api.string()
  }).body({
    name: 'top',
    foo: 'bar'
  }).options({
    unknown: false
  }).validate();

  expect(hasError).toEqual({ type: 'only' });
});
