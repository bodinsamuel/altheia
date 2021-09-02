# Altheia

A very simple, fast and customizable async data validator, inspired by Joi .

```javascript
await alt
  .string()
  .email()
  .custom('not_in_db', async (val) => await searchDB(val));
```

Online documentation: [github.io/altheia/](https://bodinsamuel.github.io/altheia/)

## 🤓 Why?

After searching for a long time a simple data validator that allow async validation, I decided to implement one. Heavily inspired from Joi, it aim at being very lightweight, simple to use and allow to check anything from standard schema to very custom ones.

The goal of this library is to validate json -- for example in express middleware -- and complexe javascript object.

- 💅 **Easy to customize.** Use builtin or create your own validation.
- ⚡️**Async.** Call any resources asynchronously to do check your data (e.g: database, xhr...)
- 🤩 **Typescript.** No more checking long documentation and wondering what to write.
- 🧘 **Easy to use.** No configuration required

## ✨ Install

```bash
npm install altheia-async-data-validator
```

```sh
yarn add altheia-async-data-validator
```

## 🖼 Example

```javascript
import alt from 'altheia-async-data-validator'

alt.lang('string.min', (name, args) => `This ${name} is too short`);
alt.template('login', alt.string().min(3).not('admin'));

const errors = await alt({
    login: alt.is('login'),
    email: alt.string()
        .email()
        .custom('not_in_db', async (val) => await searchDB(val)),
    eyes: alt.number().integer().positive().max(2),
    date: alt.date().iso(),
    gender: alt.string().if({
        test: test => test.uppercase(),
        then: test => test.in('F', 'M'),
        otherwise: test => test.in('female', 'male')
    })
}).options({
    required: true
}).validate({
    login: 'leela',
    email: 'captain@planetexpress.com',
    eyes: 1,
    date: '2015-01-04T17:35:22Z',
    gender: 'female',
});

console.log(errors); // false
```

## 📚 Documentation

- Full [Documentation](/docs/)
- Validator [API](/docs/api.md)
- [Changelog](../master/CHANGELOG.md)

## 📋 Contributing

Every contribution or feature requests will be gladly accepted in the issue section.
