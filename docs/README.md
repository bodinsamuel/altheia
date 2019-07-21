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

- 👯‍ [Creating instance](/docs/core-concepts.md#)
- ⚡️ [Using Async](/docs/core-concepts.md#)
- 💪🏻 [Custom Check](/docs/core-concepts.md#)
- 🗯 [Language and translation](/docs/core-concepts.md#)
- 🎨 [Reusing validation with Template](/docs/core-concepts.md#)
- 👾 [Code your own Plugin](/docs/core-concepts.md#)

## API

To see all validators and main api => [API](/docs/api.md)

**Validators:**

- [Global](/docs/api.md#global)
- [Any](/docs/api.md#any)
- [String](/docs/api.md#string)
- [Object](/docs/api.md#object)
- [Date](/docs/api.md#date)
- [Number](/docs/api.md#number)
- [Array](/docs/api.md#array),
- [Boolean](/docs/api.md#boolean)
- [Internet](/docs/api.md#internet)
- [Function](/docs/api.md#function)

## Contribute

See [Contributing](/docs/contributing.md)
