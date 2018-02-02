const Alt = require('./../src');
const AltInternet = require('./../src/internet');

const alt = Alt.instance();
alt.use(AltInternet);


describe('String', () => {
  describe('typeof()', () => {
    test('should pass', async () => {
      const hasError = await alt.internet().validate('hello');
      expect(hasError).toBe(false);
    });
    test('should fail', async () => {
      const hasError = await alt.internet().validate(1);
      expect(alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'internet.typeof',
        message: 'value must be a valid string'
      });
    });
  });

  describe('url()', () => {
    test('should pass', async () => {
      const hasError = await alt.internet().url().validate('http://hello.com');
      expect(hasError).toBe(false);
    });
    test('should pass: https', async () => {
      const hasError = await alt.internet().url().validate('https://hello.com');
      expect(hasError).toBe(false);
    });
    test('should not pass: hostname', async () => {
      const hasError = await alt.internet().url().validate('localhost.com');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: relative', async () => {
      const hasError = await alt.internet().url().validate('//hello.com');
      expect(hasError).toBeTruthy();
      expect(alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'internet.url',
        message: 'value must be a valid url'
      });
    });
    test('should not pass: string', async () => {
      const hasError = await alt.internet().url().validate('localhost');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: javascript', async () => {
      // eslint-disable-next-line
      const hasError = await alt.internet().url().validate('javascript:void(0)');
      expect(hasError).toBeTruthy();
    });
  });

  describe('hostname()', () => {
    test('should pass', async () => {
      const hasError = await alt.internet().hostname().validate('hello.com');
      expect(hasError).toBe(false);
    });
    test('should pass: string', async () => {
      const hasError = await alt.internet().hostname().validate('hello');
      expect(hasError).toBe(false);
    });
    test('should pass: subdomain, tld', async () => {
      const hasError = await alt.internet().hostname().validate('foo.hello.io');
      expect(hasError).toBe(false);
    });
    test('should pass: ip', async () => {
      const hasError = await alt.internet().hostname().validate('10.1.100.20');
      expect(hasError).toBe(false);
    });
    test('should not pass: port', async () => {
      const hasError = await alt.internet().hostname().validate('hello.io:8080');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: sentence', async () => {
      const hasError = await alt.internet().hostname().validate('blabbal foo.hello.io dfkljdf');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: url', async () => {
      const hasError = await alt.internet().hostname().validate('http://foo.hello.io');
      expect(hasError).toBeTruthy();
      expect(alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'internet.hostname',
        message: 'value must be a valid hostname'
      });
    });
  });

  describe('hex()', () => {
    test('should pass: upper', async () => {
      const hasError = await alt.internet().hex().validate('123456789AbCdEf');
      expect(hasError).toBe(false);
    });
    test('should pass: lower', async () => {
      const hasError = await alt.internet().hex().validate('123456789abcdef');
      expect(hasError).toBe(false);
    });
    test('should not pass', async () => {
      const hasError = await alt.internet().hex().validate('123afg');
      expect(hasError).toBeTruthy();
      expect(alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'internet.hex',
        message: 'value must be a valid hex'
      });
    });
  });

  describe('creditCard', () => {
    test('should pass', async () => {
      // => https://www.paypalobjects.com/en_AU/vhelp/paypalmanager_help/credit_card_numbers.htm
      const tests = [
        '378734493671000',
        '371449635398431',
        '378282246310005',
        '341111111111111',
        '5610591081018250',
        '5019717010103742',
        '38520000023237',
        '30569309025904',
        '6011000990139424',
        '6011111111111117',
        '6011601160116611',
        '3566002020360505',
        '3530111333300000',
        '5105105105105100',
        '5555555555554444',
        '5431111111111111',
        '6331101999990016',
        '4222222222222',
        '4012888888881881',
        '4111111111111111'
      ];
      for (var i = 0; i < tests.length; i++) {
        const hasError = await alt.internet().creditCard().validate(tests[i]);
        expect(hasError).toBe(false);
      }
    });
    test('should pass: formatted space', async () => {
      const hasError = await alt.internet().creditCard().validate('2221 0012 3412 3456');
      expect(hasError).toBe(false);
    });
    test('should pass: formatted union', async () => {
      const hasError = await alt.internet().creditCard().validate('2221-0012-3412-3456');
      expect(hasError).toBe(false);
    });
    test('should not pass: string int', async () => {
      const hasError = await alt.internet().creditCard().validate('2221');
      expect(hasError).toBeTruthy();
    });
    test('should not pass: string', async () => {
      const hasError = await alt.internet().creditCard().validate('foobar');
      expect(hasError).toBeTruthy();
      expect(alt.formatError(hasError)).toEqual({
        label: 'value',
        type: 'internet.creditCard',
        message: 'value must be a valid Credit Card'
      });
    });
  });


  describe('uuidv4', () => {
    test('should pass', async () => {
      const tests = [
        'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
        'B59511BD6A5F4DF09ECF562A108D8A2E',
        '69593D62-71EA-4548-85E4-04FC71357423',
        '677E2553DD4D43B09DA77414DB1EB8EA',
        '5ba3bba3-729a-4717-88c1-b7c4b7ba80db',
        '7e9081b59a6d4cc1a8c347f69fb4198d',
        '0c74f13f-fa83-4c48-9b33-68921dd72463',
        'b4b2fb69c6244e5eb0698e0c6ec66618'
      ];
      for (var i = 0; i < tests.length; i++) {
        const hasError = await alt.internet().uuidv4().validate(tests[i]);
        expect(hasError).toBe(false);
      }
    });
    test('should fail', async () => {
      const tests = [
        'bd2e3ee3-8908-4665-1b59-682587236654',
        '5a028adb-c082-8980-aab3-f3c16642281a',
        '999999999999999999999999999999999999',
        '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db',
        '5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
        'dfksdjfldskjf'
      ];
      for (var i = 0; i < tests.length; i++) {
        const hasError = await alt.internet().uuidv4().validate(tests[i]);
        expect(hasError).toBeTruthy();
        expect(alt.formatError(hasError)).toEqual({
          label: 'value',
          type: 'internet.uuidv4',
          message: 'value must be a valid token'
        });
      }
    });
  });
});
