# Core concepts

## 👯‍ Creating Instance

To keep reuse validation accros your project, you can create an instance of altheia. All your custom check, templates, lang will follow the instance without modifying the global object.

```javascript
const copy = alt.instance();
copy.string().validate('😎');
```

## ⚡️ Using async

The main goal of Altheia was to achieve **async validation**, especially to allow database/api call streamlined with pure data validation.
To allow this, the code was builded around async/await.

```javascript
const errors = await alt.string().validate(1);

const errors = await alt({
  login: alt.string(),
}).validate({ login: 'foobar' });
```

Alternative with callbacks

```javascript
Alt.string().validate(1, (errors) => {});

Alt({
  login: Alt.string(),
}).validate({ login: 'foobar' }, (errors) => {});
```

This mean you can chain simple check and your database check. Something we used to do in 2 steps in api now can be done seamlessly, for example:

```javascript
const newUser = { login: 'admin' };

const errors = await alt({
  login: alt
    .string()
    .min(4)
    .custom('isLoginUniqueInDb', async (value) => {
      return (await myDb.findByLogin(value)) === null;
    }),
}).validate(newUser);
```

## 💪🏻 Custom check

One thing that all validators miss is... the very custom validation you need for your project. You always want something very precise that will be useful only for you and that does not belongs in the main library. But you don't want to spend hours forking a library or configuring json schema...

We got you covered with `custom()` validation. We provide the interface, you code:

```javascript
Alt.string().custom('wait', async (test) => {
  return await checkMySuperCustomData(test);
});
```

## 🗯 Language and Translation

Altheia provides default english error message. If you want to change those, you can easily override language strings by creating a new instance with an object that will be merge with default and/or calling `lang()` to add a new entry on the fly.

```javascript
const copy = alt.instance({
  'string.min': (name, args) => `This ${name} is not long enough`,
});
```

```javascript
copy.lang('string.min', (name, args) => `This ${name} is not long enough`});
```

## 🎨 Templates

When you are manipulating a large API, you can feel you are writing the same validation hover and hover. Templates are a very easy way to reduce redundancy in your code and sync all your schemas, while being very light to use.

Combined with Instance and Plugins, you can have a master file that import Altheia and declare all your basic input. Then import it everywhere you want.

```javascript
/*** --- myaltheia.ts **/
import alt from 'altheia-async-data-validator';
const copy = alt.instance();

copy.template('login', Alt.string().lowercase());
copy.template('password', Alt.string().min(6));
export default copy;

/*** --- index.ts **/
import alt from './myaltheia.ts';
alt({
  login: alt.is('login'),
  password: alt.is('password').required(), // keeps chainability
}).validate({ login, password });
```

## 👾 Plugins

In Altheia everything is a plugin. That means even the basic validators are actually plugins. You can easily extends the core of Altheia this way.

```javascript
const copy = Alt.instance();

copy.use({
  messages: {
    'custom.myrule': () => `not good`,
  },
  Class: class Custom extends TypeBase {
    myrule() {
      this.test('myrule', (str) => {
        return str !== true;
      });
      return this;
    }
  },
});
```

## What's next

Take a look at the [Validator](validator.md) api
