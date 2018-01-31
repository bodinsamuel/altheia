const Api = require('./../src');

const timeoutSuccess = (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

describe('String', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass: int', async () => {
      const hasError = await Api.string().validate(1);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: boolean', async () => {
      const hasError = await Api.string().validate(true);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: func', async () => {
      const hasError = await Api.string().validate(() => 1);
      expect(hasError).toBeTruthy();
    });
    test('should not pass: obj', async () => {
      const hasError = await Api.string().validate({});
      expect(hasError).toBeTruthy();
    });
  });

  describe('min()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().min(2).validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().min(2).validate('a');
      expect(hasError).toBeTruthy();
    });
  });

  describe('max()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().max(2).validate('a');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().max(2).validate('foobar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('pattern()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().pattern(/^[a-z]+$/).validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().pattern(/^[a-z]+$/).validate('f00bar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('in()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().in('foobar').validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().in('barfoo').validate('foobar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('not()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().not('barfoo').validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().not('foobar').validate('foobar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('email()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().email().validate('foo@bar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().email().validate('foobar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('lowercase()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().lowercase().validate('foobar');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().lowercase().validate('fooBar');
      expect(hasError).toBeTruthy();
    });
  });

  describe('uppercase()', () => {
    test('should pass', async () => {
      const hasError = await Api.string().uppercase().validate('FOOBAR');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await Api.string().uppercase().validate('FOObAR');
      expect(hasError).toBeTruthy();
    });
  });

  describe('*', () => {
    test('longest possible sequence (with async custom)', async () => {
      const hasError = await Api.string()
        .min(2)
        .max(15)
        .pattern(/[a-z]+/)
        .in('published', 'delete')
        .not('draft')
        .custom(timeoutSuccess)
        .validate('published');

      expect(hasError).toBe(false);
    });
  });
});
