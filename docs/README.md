# Altheia Documentation

## 🤓 Why?

After searching for a long time a simple data validator that allow async validation, I decided to implement one. Heavily inspired from Joi, it aim at being very lightweight, simple to use and allow to check anything from standard schema to very custom ones.

The goal of this library is to validate json -- for example in express middleware -- and complexe javascript object.

- 💅 **Easy to customize.** Use builtin or create your own validation.
- ⚡️**Async.** Call any resources asynchronously to do check your data (e.g: database, xhr...)
- 🤩 **Typescript.** No more checking long documentation and wondering what to write.
- 🧘 **Easy to use.** No configuration required

## Install

```bash
npm install altheia-async-data-validator
```

```sh
yarn add altheia-async-data-validator
```

## Use

One simple step, import the library

```javascript
import alt from 'altheia-async-data-validator';
// or
const alt = require('altheia-async-data-validator');
```

Typescript definitions are builtin the library, no need to install an other package.

## Core Concepts

- 👯‍ [Creating instance](core-concepts.md#)
- ⚡️ [Using Async](core-concepts.md#)
- 💪🏻 [Custom Check](core-concepts.md#)
- 🗯 [Language and translation](core-concepts.md#)
- 🎨 [Reusing validation with Template](core-concepts.md#)
- 👾 [Code your own Plugin](core-concepts.md#)

## API

To see all validators and main api => [API](api.md)

**Validators:**

- [Global](api.md#global)
- [Any](api.md#any)
- [String](api.md#string)
- [Object](api.md#object)
- [Date](api.md#date)
- [Number](api.md#number)
- [Array](api.md#array),
- [Boolean](api.md#boolean)
- [Internet](api.md#internet)
- [Function](api.md#function)

## Contribute

See [Contributing](contributing.md)
