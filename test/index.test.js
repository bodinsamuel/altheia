const Api = require('./../src');

describe('index', () => {
  test('Should be a func', async () => {
    expect(Api).toBeInstanceOf(Function);
  });
});
