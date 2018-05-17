# Documentation
- [Core Concepts](#coreconcepts)
- [Methods](#methods)
    + [Main Api](#mainapi)
    + [Types](#types)
        * [Global](#global)
        * [String](#string)
        * [Object](#object)
        * [Date](#date)
        * [Number](#number)
        * [Array](#array)
        * [Internet](#internet)

## Core Concepts
### Instance
To keep Altheia simple and fast, the lib is not fully immutable but you can create an instance of altheia to avoid modifying the global object.

```javascript
const Instance = Alt.instance();
```

### Async
The main goal of Altheai was to achieve async validation, especially to allow database/api call streamlined with pure data validation.
To allow this, the code was builded around async/await.

You have two methods to get results: callback
```javascript
Alt.string().validate(1, (error) => {
    // do something
});

Alt({
    login: Alt.string()
}).body({ login: 'foobar' }).validate((error) => {
    // do something
});
```

or await (which is cleaner obviously)
```javascript
const hasError = await Alt.string().validate(1);

const hasError = await Alt({
    login: Alt.string()
}).body({ login: 'foobar' }).validate();
```

### Lang / i18n
You can easily override languages string by creating a new instance with an object that will be merge with default and/or calling `lang()` to add a new entry on the fly.
Entries are required to be a method that accept two parameters:

    - `name`: contain the name of the value
    - `args`: the arguments passed to the validator (if any)


```javascript
const Instance = Alt.instance({
    'string.min': (name, args) => `This ${name} is not long enough`
});
```
```javascript
Instance.lang('string.min', (name, args) => `This ${name} is not long enough`});
```

### Templates
When you are manipulating a large api, you can feel you are writing the same validation hover and hover. Templates are a very easy way to reduce redundancy in your code and sync all your schemas, while being very light to use.

For example, you can have a master file that import Altheia and declare all your basic input. Then import it everywhere you want.

```javascript
/*** --- myaltheia.js **/
const Alt = require('altheia-async-data-validator');
const alt = Alt.instance();

alt.template('login', Alt.string().lowercase());
alt.template('password', Alt.string().min(6));
module.exports alt;

/*** --- index.js **/
const alt = require('./myaltheia.js');
alt({
    login: alt.is('login'),
    password: alt.is('password').required() // keeps chainability
})
```

### Plugins
In Altheia everything is a plugin. That means that even the basic validator are actually plugins. You can easily extends the core of Altheai this way.
By default, it loads array, date, string, number, object, string.

```javascript
const alt = Alt.instance();
alt.use({
    lang: {
        'mycustom.myrule': () => `not good`
    },
    Class: class mycustom extends Alt.Base {
        myrule() {
            this.test('myrule', (str) => {
                return true;
            });
            return this;
        }
    }
});
```
__Plugins available__: internet


### Customization
One thing that all validators miss is ... the very custom validation you need for your project. You always want something very precise that will be usefull only for you and that does not belongs in the main library.

We got you covered with `custom()` validation.

```javascript
Alt.string().custom('wait', (test) => {
    return new Promise((resolve) => {
        // simulate a very long database call, because we can
        setTimeout(resolve, 1000);
    });
})
```


# Methods
## Main Api
### `validate([:func])`
> Run the validation of the schema. You can `await` or pass a callback.

```javascript
const hasError = await Alt({
    login: Alt.string().min(1)
}).body({
    login: 'foobar'
}).validate();

//=> :false if no error
//=> :array if any
```

### `body(:object)`
> Set the body to be validated.
```javascript
const hasError = await Alt(...).body({
    login: 'foobar'
}).validate();
```

### `options(:object)`
> By default, Altheia allow __unknow__ and  __unexisting__ key to be present in the schema. You can change these values to be more strict.

```javascript
Alt({
    login: Alt.string()
}).options({
    required: false, // pass it to :true, to force all fields to be required
    unknown: true   // pass it to :false, to disallow unknown fields
});
```

### `confirm(:string, :string)`
> Because a single value validation do not share any context with one another (because you know ...async), confirmation is being done in the global schema validation.

```javascript
Alt({
    password: Alt.string().min(6),
    repeat: Alt.string()
}).confirm('password', 'repeat').validate();
```

### `lang(:string, :func)`
> Add or change a lang entry.
```javascript
Alt.lang('string.min', () => `not good`);
```

### `use(:string, :func)`
> Add a plugin to your Altheia instance
```javascript
Alt.use({
    lang: { ...}
    Class: class foobar extends Alt.Base {}
});
```

## Types
### Global
These methods are applying to all the types.

#### `required()`
> Force an input to be present and defined
```javascript
Alt.string().required()
```

#### `custom(:string, :func)`
> Execute whatever you want, can be asynchronous obviously.
```javascript
Alt.string().custom('my', (test) => {
    return test === 'foobar';
});
```

#### `if({ test :func, then :func, otherwise :func })`
> Alternatives are great to adapt the validation with some conditions. All functions are required to return an instance of a validator.

```javascript
Alt.string().if({
    test: test => test.uppercase(),
    then: test => test.min(10).max(50),
    otherwise: test => test.email()
});
// which can be pseudo-coded to
// If (test.isString)
//    if (test.isUppercase)
//      test.isMin(10) && test.IsMax(50)
//    else
//      test.isEmail
//
```

#### `validate(:mixed[, :func])`
> If you want to, you can validate only one input without the whole schema.
> You can await or pass callback

```javascript
const hasError = await Api.string().validate(1);
//=> :false if no error
//=> :object if not
```
### String
#### `min(:int)`
> Force a string to be equal or more to the value passed.
```javascript
Alt.string().min(1);
```

#### `max(:int)`
> Force a string to be equal or less to the value passed.
```javascript
Alt.string().max(5);
```

#### `pattern(:regex)`
> Force a string to match the regex passed.
```javascript
Alt.string().pattern(/^[a-z]$/);
```

#### `in(value [,value...])`
> Force a string to be equal to one of the value passed in the set.
```javascript
Alt.string().in('foo', 'bar');
```

#### `not(value [,value...])`
> Force a string to be different to all of the value passed in the set.
```javascript
Alt.string().not('bar', 'foo');
```

#### `email()`
> Force a string to be a valid email (contain an @).
```javascript
Alt.string().email();
```

#### `lowercase()`
> Force a string to be fully in lowercase.
```javascript
Alt.string().lowercase();
```

#### `uppercase()`
> Force a string to be fully in uppercase.
```javascript
Alt.string().uppercase();
```

### Object
#### `in(value [,value...])`
> Force an object to have only the keys passed in the set
```javascript
Alt.object().in('foo', 'bar');
```

#### `not(value [,value...])`
> Force an object to not have the keys passed in the set
```javascript
Alt.object().not('foo', 'bar');
```

#### `schema({ schema :Validator, returnErrors :bool })`
> Check an object with the passed schema. It will help you check nested object without effort. Because schema need to be instance of Altheia, you can do whatever you want without restriction. `returnErrors` to `true` will return errors with the main payload if any.
```javascript
Alt.object().schema({
    schema: Alt({
            foo: Alt.string(),
            bar: Alt.number(),
        }).options({ required: true }),
    returnErrors: true,
});
```


### Date
#### `iso()`
> Force a date to be a valid ISO-8601.
```javascript
Alt.date().iso();
```

#### `min()`
> Force a date to be a at least or bigger than value passed
```javascript
Alt.date().min(new Date('2017-08-01'));
```

#### `max()`
> Force a date to be less or equal than value passed
```javascript
Alt.date().max(new Date('2017-08-01'));
```

### Number
#### `min(:int)`
> Force a number to be equal or more to the value passed.
```javascript
Alt.number().min(5);
```

#### `max(:int)`
> Force a number to be equal or less to the value passed.
```javascript
Alt.number().max(10);
```

#### `integer()`
> Force a number to be an integer.
```javascript
Alt.number().integer();
```

#### `unsigned()`
> Force a number to be unsigned.
```javascript
Alt.number().unsigned();
```

#### `positive()`
> Force a number to be greater than 0.
```javascript
Alt.number().positive();
```

#### `negative()`
> Force a number to be lesser than 0.
```javascript
Alt.number().negative();
```


### Array
#### `min(:int)`
> Force an array to contains at least a number of items equal to the value passed.
```javascript
Alt.array().min(5);
```

#### `max(:int)`
> Force an array to contains at most a number of items equal to the value passed.
```javascript
Alt.array().max(10);
```

#### `in(value [,value...])`
> Force an array to have only the keys passed in the set
```javascript
Alt.array().in('foo', 'bar');
```

#### `not(value [,value...])`
> Force an array not to have the keys passed in the set
```javascript
Alt.object().not('foo', 'bar');
```

#### `unique()`
> Force an array to only have each item once
```javascript
Alt.object().unique();
```


### Internet
> Internet plugins is not loaded by default.
```javascript
const InternetValidator = require('altheia-async-data-validator/src/internet');
Alt.use(InternetValidator);
```

#### `url()`
> Force a string to be a valid url (RFC)
```javascript
Alt.internet().url();
```

#### `hostname()`
> Force a string to be a valid hostname (RFC)
```javascript
Alt.internet().hostname();
```

#### `hex()`
> Force a string to be a valid hex (a-f0-9)
```javascript
Alt.internet().hex();
```

#### `creditCard()`
> Force a string to be a valid credit card (using Luhn's algorithm)
```javascript
Alt.internet().creditCard();
```

#### `uuidv4()`
> Force a string to be a valid uuid version 4
```javascript
Alt.internet().uuidv4();
```

#### `ip()`
> Force a string to be a valid ipv4 or ipv6
```javascript
Alt.internet().ip();
```

#### `ipv4()`
> Force a string to be a valid ipv4
```javascript
Alt.internet().ipv4();
```

#### `ipv6()`
> Force a string to be a valid ipv6
```javascript
Alt.internet().ipv6();
```
