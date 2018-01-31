const Api = require('./../src');

const timeoutSuccess = (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

describe('Number', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().validate(1);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Api.number().validate(1.1);
      expect(hasError).toBe(false);
    });
    test('should not pass: string', async () => {
      const hasError = await Api.number().validate('1');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: boolean', async () => {
      const hasError = await Api.number().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Api.number().validate(() => 1);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Api.number().validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().min(2).validate(2);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Api.number().min(2).validate(3);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().min(2).validate(1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().max(20).validate(20);
      expect(hasError).toBe(false);
    });
    test('should pass', async () => {
      const hasError = await Api.number().max(20).validate(18);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().max(20).validate(21);
      expect(hasError).toBeTruthy();
    });
  });

  describe('integer()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().integer().validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().integer().validate(1.1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('unsigned()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().unsigned().validate(0);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().unsigned().validate(-1);
      expect(hasError).toBeTruthy();
    });
  });

  describe('positive()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().positive().validate(1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().positive().validate(0);
      expect(hasError).toBeTruthy();
    });
  });

  describe('negative()', () => {
    test('should pass', async () => {
      const hasError = await Api.number().negative().validate(-1);
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.number().negative().validate(1);
      expect(hasError).toBeTruthy();
    });
  });
});


  // describe('()', () => {
  //   test('should pass', async () => {
  //     const hasError = await Api.number().aaaaa().validate(1);
  //     expect(hasError).toBe(false);
  //   });
  //   test('should not pass', async () => {
  //     const hasError = await Api.number().aaaaaa().validate(1111);
  //     expect(hasError).toBeTruthy();
  //   });
  // });
