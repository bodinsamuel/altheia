module.exports = class Base {
  constructor() {
    this.value = null;
    this.required = false;
    this.tests = [];
  }

  test(name, func) {
    this.tests.push({
      name,
      func,
      isValid: true
    });
  }

  async validate(toTest, callback) {
    this.value = toTest;
    for (var i = 0; i < this.tests.length; i++) {
      const test = this.tests[i];
      const isValid = await test.func(this.value);
      if (isValid === false) {
        if (callback) {
          callback({ type: test.name });
        }
        return { type: test.name };
      }
    }

    if (callback) {
      callback(false);
    }
    return false;
  }

  custom(callback) {
    this.test('custom', async (str) => {
      try {
        return await callback(str);
      } catch (e) {
        return false;
      }
    });
    return this;
  }
};
