# Altheia
[![Build Status](https://travis-ci.org/bodinsamuel/altheia.svg?branch=master)](https://travis-ci.org/bodinsamuel/altheia) [![Coverage Status](https://coveralls.io/repos/github/bodinsamuel/altheia/badge.svg?branch=master)](https://coveralls.io/github/bodinsamuel/altheia?branch=master)


A very simple, fast and customizable async data validator, inspired by Joi .

```javascript
await Alt.string().email().custom('not_in_db', async (val) => await searchDB(val))
```

# Introduction
After searching for a long time a simple data validator that allow async validation, I decided to implement one. Heavily inspired from Joi, it aim at being very lightweight, simple to use and obvioulsy allow us to check anything from standard schema to very custom ones.

It's primary goal was to be used in batch json validation (i.e: for API).
With Altheai you can easily:
- change errors messages
- add custom validation
- call anything asynchronously to do further check (database, xhr...)
- do nested object validation
- adaptative validation with if() condition
- reuse validation scheme...

# Install
```bash
$ npm install altheia-async-data-validator
```


# Example
```javascript
const Alt = require('altheia-async-data-validator');
// or: import Alt from 'altheia-async-data-validator'

Alt.lang('string.min', (name, args) => `This ${name} is too short I think`});
Alt.template('login', Alt.string().min(3).not('admin'));

const hasError = await Alt({
    login: Alt.is('login').required(),
    email: Alt.string().email().custom('not_in_db', async (val) => await searchDB(val)),
    eyes: Alt.number().integer().positive().max(2),
    date: Alt.date().iso(),
    gender: Alt.string().if({
        test: test => test.uppercase(),
        then: test => test.in('F', 'M'),
        otherwise: test => test.in('female', 'male')
    })
}).options({
    required: true,
    unknown: false
}).body({
    login: 'leela',
    email: 'captain@planetexpress.earth',
    eyes: 1,
    date: '2015-01-04T17:35:22Z',
    gender: 'female',
}).validate();

console.log(hasError); // false
```


# Documentation + Api
You can find the full [documentation here](../master/Documentation.md)


# Contributing
Every contribution or request will be gladly accepted in this issues section.
