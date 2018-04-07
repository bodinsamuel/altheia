# Altheia
[![Build Status](https://travis-ci.org/bodinsamuel/altheia.svg?branch=master)](https://travis-ci.org/bodinsamuel/altheia) [![Coverage Status](https://coveralls.io/repos/github/bodinsamuel/altheia/badge.svg?branch=master)](https://coveralls.io/github/bodinsamuel/altheia?branch=master)


A very simple async data validator, very fast and customizable, inspired by Joi .

```javascript
await Alt.string().email().custom('not_in_db', (val) => searchDB(val))
```

# Introduction
After searching for a long time a simple data validator that allow async validation, I decided to implement one. Heavily inspired from Joi, it aim at being very lightweight, simple to use and obvioulsy allow us to check anything from standard schema to very custom ones.

It aim to be used in models Validation (i.e: for API)

# Install
```bash
$ npm install altheia
```


# Example
```javascript
const Alt = require('Alt');

Instance.lang('string.min', (name, args) => `This ${name} quiet short my friend`});

const hasError = await Alt({
    login: Alt.string().min(3).not('admin').required(),
    email: Alt.string().email().custom('not_in_db', (val) => searchDB(val)),
    eyes: Alt.number().integer().positive().max(2),
    date: Alt.date().iso()
}).options({
    required: true,
    unknown: false
}).body({
    login: 'leela',
    email: 'captain@planetexpress.earth',
    eyes: 1,
    date: '2015-01-04T17:35:22Z'
}).validate();

console.log(hasError); // false
```


# Documentation
You can find the [documentation here](../master/Documentation.md)


# Contributing
Every contribution or request will be gladly accepted in this issues section.
