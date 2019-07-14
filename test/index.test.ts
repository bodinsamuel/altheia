import Alt from './../src';
import StringValidator from './../src/string');

describe('Index', () => {
  describe('instance()', () => {
    test('clone should not alter themselves nor the original', () => {
      const alt1 = Alt.instance();
      const alt2 = Alt.instance();
      alt1.foo = 'bar';
      alt2.bar = 'foo';
      expect(alt1).toHaveProperty('foo');
      expect(alt1).not.toHaveProperty('bar');

      expect(alt2).toHaveProperty('bar');
      expect(alt2).not.toHaveProperty('foo');

      expect(Alt).not.toHaveProperty('bar');
      expect(Alt).not.toHaveProperty('foo');
    });

    test('should have basic lang', () => {
      const alt1 = Alt.instance();
      expect(alt1.langList).toBeInstanceOf(Object);
      expect(alt1.langList['string.min']).toBeInstanceOf(Function);
      expect(alt1.langList['string.min']('value', { min: 1 })).toBe(
        'value must be at least 1 characters long'
      );
    });

    test('should merge lang and keep original', () => {
      const alt1 = Alt.instance({
        'string.min': () => 'foobar',
      });
      expect(alt1.langList).toBeInstanceOf(Object);
      expect(alt1.langList['string.min']).toBeInstanceOf(Function);
      expect(alt1.langList['string.min']()).toBe('foobar');

      expect(Alt.langList['string.min']('value', { min: 1 })).toBe(
        'value must be at least 1 characters long'
      );
    });
  });

  describe('use()', () => {
    test('should create a new instance with custom plugin', () => {
      const alt1 = Alt.instance();
      alt1.use({
        lang: {
          'mycustom.myrule': () => 'not good',
        },
        Class: class mycustom extends Alt.Base {
          // eslint-disable-next-line
          myrule() {
            this.test('myrule', () => {
              return true;
            });
            return this;
          }
        },
      });

      expect(alt1).toHaveProperty('mycustom');
      expect(Alt).not.toHaveProperty('mycustom');

      // new instance should start clean
      const alt2 = alt1.instance();
      expect(alt2).not.toHaveProperty('mycustom');
    });
  });

  describe('template()', () => {
    test('should add a template in the instance', () => {
      const alt1 = Alt.instance();
      const alt2 = Alt.instance();
      alt1.template(
        'login',
        Alt.string()
          .min(6)
          .max(10)
      );

      expect(alt1).toHaveProperty('templates');
      expect(alt1.templates).toHaveProperty('login');
      expect(alt1.templates.login).toBeInstanceOf(StringValidator);

      expect(alt2.templates).not.toHaveProperty('login');
    });

    test('should get template back', () => {
      const alt1 = Alt.instance();
      alt1.template(
        'login',
        Alt.string()
          .min(6)
          .max(10)
      );

      const back = alt1.is('login');

      expect(back).toBeInstanceOf(StringValidator);
    });

    test('should get template back and not modify template', () => {
      const alt1 = Alt.instance();
      alt1.template(
        'login',
        Alt.string()
          .min(6)
          .max(10)
      );

      const back = alt1.is('login').lowercase();
      expect(back).toBeInstanceOf(StringValidator);
      expect(back.tests.length).toBe(4);

      expect(alt1.is('login').tests.length).toBe(3);
    });

    test('should throw on bad template', () => {
      const alt1 = Alt.instance();
      expect(() => {
        alt1.is('login');
      }).toThrow();
    });
  });
});
