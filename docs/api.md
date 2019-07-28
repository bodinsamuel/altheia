# API

To start using Altheia, require the package this way:

```js
import alt from 'altheia-async-data-validator';
```

This documentation presents all available methods but you can also refer to the **Typescript definitions** in your IDE.

- [Main](#main)
  - [`validate()`](#validatebody-object-callbackfunc)
  - [`body()`](#bodyvalue-object)
  - [`clone()`](#clone)
  - [`options()`](#optionsparams-object)
  - [`confirm()`](#confirmkey1-string-key2-string)
  - [`lang()`](#langname-string-callback-func)
  - [`use()`](#useplugin-object)
- [Base Type](#base-type)
  - [`required()`](#required)
  - [`custom()`](#customname-string-callback-func)
  - [`if()`](#if-test-func-then-func-otherwise-func)
  - [`validate()`](#validatevalue-any-callback-func)
- [Any](#any)
- [String](#string)
  - [string().`noEmpty()`](#stringnoempty)
  - [string().`min()`](#stringminint)
  - [string().`max()`](#stringmaxint)
  - [string().`pattern()`](#stringpatternregex)
  - [string().`in()`](#stringinvalue)
  - [string().`not()`](#stringnotvalue)
  - [string().`email()`](#stringemail)
  - [string().`lowercase()`](#stringlowercase)
  - [string().`uppercase()`](#stringuppercase)
- [Number](#number)
  - [number().`cast()`](#numbercast)
  - [number().`min()`](#numberminvalue-int)
  - [number().`max()`](#numbermaxvalue-int)
  - [number().`integer()`](#numberinteger)
  - [number().`unsigned()`](#numberunsigned)
  - [number().`positive()`](#numberpositive)
  - [number().`negative()`](#numbernegative)
  - [number().`in()`](#numberinvalue)
  - [number().`not()`](#numbernotvalue)
- [Object](#object)
  - [object().`in()`](#objectinvalue-string)
  - [object().`not()`](#objectnotvalue-string)
  - [object().`schema()`](#objectschemaschema-validator)
  - [object().`oneOf()`](#objectoneofkeys-string)
  - [object().`allOf()`](#objectallofkeys-string)
- [Array](#array)
  - [array().`min()`](#arrayminvalue-int)
  - [array().`max()`](#arraymaxvalue-int)
  - [array().`in()`](#arrayinvalue-string)
  - [array().`not()`](#arraynotvalue-string)
  - [array().`unique()`](#arrayunique)
  - [array().`oneOf()`](#arrayoneoftemplates-typebase)
- [Boolean](#boolean)
  - [boolean().`cast()`](#booleancast)
  - [boolean().`true()`](#booleantrue)
  - [boolean().`false()`](#booleanfalse)
- [Date](#date)
  - [date().`iso()`](#dateiso)
  - [date().`min()`](#dateminvalue-date)
  - [date().`max()`](#datemaxvalue-date)
- [Internet](#internet)
  - [internet().`url()`](#interneturl)
  - [internet().`hostname()`](#internethostname)
  - [internet().`hex()`](#internethex)
  - [internet().`creditCard()`](#internetcreditcard)
  - [internet().`uuidv4()`](#internetuuidv4)
  - [internet().`ip()`](#internetip)
  - [internet().`ipv4()`](#internetipv4)
  - [internet().`ipv6()`](#internetipv6)
- [Function](#function)

## Main

### `validate(body?: object, callback?:func)`

> Run the validation of the schema. You can `await` or pass a callback.

```javascript
const errors = await alt({
  login: alt.string().min(1),
}).validate({
  login: 'foobar',
});

//=> "false" if no error
//=> "ValidatorErrorFormatted[]" if any errors
```

### `body(value: object)`

> Set the body to be validated.

```javascript
const hasError = await alt(...).body({
    login: 'foobar'
}).validate();
```

### `clone()`

> Once a Validator has been validated, it carry on the results. You can clone it to clean the class and validate an other body. It's ligth, it simply pass the schema reference without copying the results.

```javascript
const schema = alt({
  login: alt.string(),
});

const clone1 = schema.clone();
await clone1.body({ login: 'foo' }).validate();

const clone2 = schema.clone();
await clone2.body({ login: 1 }).validate();
```

### `options(params: object)`

> By default, Altheia disallow **unknown** keys in the schema and does not require what you defined as mandatory. You can change these values to be more or less strict.

```javascript
alt({
  login: alt.string(),
}).options({
  required: false, // :true, to force all fields to be required
  unknown: false, //  :true, to allow unknown fields
});
```

### `confirm(key1: string, key2: string)`

> Because a single value validation can not share any context with one another -- because everything is async -- confirmation is being done after in the global schema validation.

```javascript
alt({
  password: alt.string().min(6),
  repeat: alt.string(),
})
  .confirm('password', 'repeat')
  .validate();
```

### `lang(name: string, callback: func)`

> Add or change a lang entry.

```javascript
alt.lang('string.min', () => `not good`);
```

### `use(plugin: object)`

> Add a plugin to your Altheia instance

```javascript
alt.use({
    messages: { ...}
    Class: class foobar extends alt.Base {}
});
```

---

## Base Type

All types inherit these methods.

### `required()`

> Force an input to be **different** than `null` / `undefined`

```javascript
alt.string().required();
```

### `custom(name: string, callback: func)`

> Execute whatever you want, can be sync/async. The name parameter is there to identify this test if you want to add a `lang()`

```javascript
alt.string().custom('my', (test) => {
  return test === 'foobar';
});

alt.lang('string.custom.my', () => 'my custom test failed');
```

### `if({ test: func, then: func, otherwise: func })`

> Alternatives are great to adapt the validation with some conditions. All functions are required to return an instance of a validator, but you can switch type between tests

```javascript
// Same type
alt.string().if({
  test: (test) => test.uppercase(),
  then: (test) => test.min(10).max(50),
  otherwise: (test) => test.email(),
});

// Type mixing
alt.any().if({
  test: (test) => test.string(),
  then: (test) => test.uppercase(),
  otherwise: () => alt.number().min(10),
});
```

### `validate(value: any, callback?: func)`

> If you want to, you can validate only one input without the whole schema.
> You can await or pass callback

```javascript
const hasError = await Api.string().validate(1);
//=> :false if no error
//=> :object if not
```

---

## Any

> Any plugins is loaded by default since v3.0.0

Any inherit global methods and that's it. It allow chaining without knowing the type.

```javascript
alt
  .any()
  .required()
  .custom();
```

---

## String

### string().`noEmpty()`

> Force a string to be **not empty** `""`, wether this validator is required or not.
> Altheia does make a **difference** between `null/undefined` and `""`.

```javascript
alt
  .string()
  .noEmpty()
  .validate('');
```

### string().`min(:int)`

> Force a string to have a length of at least the value passed.

```javascript
alt.string().min(1);
```

### string().`max(:int)`

> Force a string to have lenght of equal or less to the value passed.

```javascript
alt.string().max(5);
```

### string().`pattern(:regex)`

> Force a string to match the regex passed.

```javascript
alt.string().pattern(/^[a-z]$/);
```

### string().`in(...value)`

> Force a string to exact match one of the values passed in the set.

```javascript
alt.string().in('foo', 'bar');
```

### string().`not(...value)`

> Force a string to match none of the values passed in the set.

```javascript
alt.string().not('bar', 'foo');
```

### string().`email()`

> Force a string to be a valid email (contain an @).

```javascript
alt.string().email();
```

### string().`lowercase()`

> Force a string to be entirely in lowercase.

```javascript
alt.string().lowercase();
```

### string().`uppercase()`

> Force a string to be entirely in uppercase.

```javascript
alt.string().uppercase();
```

---

## Number

### number().`cast()`

> Try to cast value to a number. This will not modify the original value.

```javascript
alt
  .number()
  .cast()
  .validate('1');
```

### number().`min(value: int)`

> Force a number to be equal or more to the value passed.

```javascript
alt.number().min(5);
```

### number().`max(value: int)`

> Force a number to be equal or less to the value passed.

```javascript
alt.number().max(10);
```

### number().`integer()`

> Force a number to be an integer.

```javascript
alt.number().integer();
```

### number().`unsigned()`

> Force a number to be unsigned.

```javascript
alt.number().unsigned();
```

### number().`positive()`

> Force a number to be greater than 0.

```javascript
alt.number().positive();
```

### number().`negative()`

> Force a number to be lesser than 0.

```javascript
alt.number().negative();
```

### number().`in(...value)`

> Force a number to be equal to one of the values passed in the set.

```javascript
alt.number().in(67, 35);
```

### number().`not(...value)`

> Force a number to be different to all of the values passed in the set.

```javascript
alt.number().not(42, 157);
```

---

## Object

### object().`in(...value: string)`

> Force an object to have only the keys passed in the set

Accept an optionnal second param:

- `{ oneErrorPerKey: boolean }` => `true` will return 1 error per invalid key.

```javascript
// will return a single error even if multiple not matching
alt.object().in('foo', 'bar');

// will return one error per key not matching
alt.object().in(['foo', 'bar'], { oneErrorPerKey: true });
```

### object().`not(...value: string)`

> Force an object to match none of the keys passed in the set

```javascript
alt.object().not('foo', 'bar');
```

### object().`schema(schema: Validator)`

> Check an object with the passed schema. It will help you check nested object without effort. Because schema need to be instance of Altheia, you can do whatever you want without restriction.

Accept an optionnal second param:

- `returnErrors: boolean` => `false` will not display nested errors.

```javascript
alt.object().schema(
  Alt({
    foo: alt.string(),
    bar: alt.number(),
  }).options({ required: true }),
  { returnErrors: false }
);
```

### object().`oneOf(...keys: string)`

> Force any keys, to be the only one present in the object (**exclusive relationships**)

Accept an optionnal second param:

- `{ oneIsRequired: boolean }` => `true` will return an error if none match, `false` (default) will not throw an error if none match.

```javascript
// 'a', 'b', 'c', 'd'
// - none of them are required
alt.object().oneOf('a', 'b', 'c', 'd');

// 'a', 'b'
// - one of them is required
alt.object().oneOf(true, 'a', 'b');
```

### object().`allOf(...keys: string)`

> Force all keys to be mutually required. If **one is presents, all are required**. Pass if none are present.

```javascript
alt.object().allOf('a', 'b', 'c');
```

---

## Array

### array().`min(value: int)`

> Force an array to contains at least a number of items equal to the value passed.

```javascript
alt.array().min(5);
```

### array().`max(value: int)`

> Force an array to contains at most a number of items equal to the value passed.

```javascript
alt.array().max(10);
```

### array().`in(...value: string)`

> Force an array to have only the values passed in the set.

```javascript
alt.array().in('foo', 'bar');
```

### array().`not(...value: string)`

> Force an array to have none of the values passed in the set.

```javascript
alt.array().not('foo', 'bar');
```

### array().`unique()`

> Force an array to only have each value once. Use javascript `Set`, not shallow check.

```javascript
alt.array().unique();
```

### array().`oneOf(...templates: TypeBase)`

> Force all array's items to match at least one of the template

```javascript
alt.array().oneOf(alt.string(), alt.number());
```

---

## Boolean

### boolean().`cast()`

> Try to cast value to a boolean. Use javascript `Boolean(value)`.

```javascript
alt
  .boolean()
  .cast()
  .validate('true');
alt
  .boolean()
  .cast()
  .validate('false');
```

### boolean().`true()`

> Force a boolean to equal `true`.

```javascript
alt.boolean().true();
```

### boolean().`false()`

> Force a boolean to equal `false`.

```javascript
alt.boolean().false();
```

---

## Date

### date().`iso()`

> Force a date to be a valid ISO-8601 date.

```javascript
alt.date().iso();
```

### date().`min(value: Date)`

> Force a date to be a at least or bigger than the value passed.

```javascript
alt.date().min(new Date('2017-08-01'));
```

### date().`max(value: Date)`

> Force a date to be less or equal than the value passed.

```javascript
alt.date().max(new Date('2017-08-01'));
```

---

## Internet

### internet().`url()`

> Force the value to be a valid url (RFC).

```javascript
alt.internet().url();
```

### internet().`hostname()`

> Force the value to be a valid hostname (RFC).

```javascript
alt.internet().hostname();
```

### internet().`hex()`

> Force the value to be a valid hex (a-f0-9).

```javascript
alt.internet().hex();
```

### internet().`creditCard()`

> Force the value to be a valid credit card. Use Luhn's algorithm.

```javascript
alt.internet().creditCard();
```

### internet().`uuidv4()`

> Force the value to be a valid uuid version 4.

```javascript
alt.internet().uuidv4();
```

### internet().`ip()`

> Force the value to be a valid ipv4 or ipv6.

```javascript
alt.internet().ip();
```

### internet().`ipv4()`

> Force the value to be a valid ipv4.

```javascript
alt.internet().ipv4();
```

### internet().`ipv6()`

> Force the value to be a valid ipv6.

```javascript
alt.internet().ipv6();
```

---

## Function

There is no method right now, it will only check if the value is valid function.

```javascript
alt.function();
```
