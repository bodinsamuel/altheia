# Altheia
[![Build Status](https://travis-ci.org/bodinsamuel/altheia.svg?branch=master)](https://travis-ci.org/bodinsamuel/altheia)

A very simple async data validator.

`await Alt.string().email().custom('notinbd', (val) => searchDB(val))`

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

const hasError = await Alt({
    login: Alt.string().min(3).not('admin'),
    email: Alt.string().email().custom('notindb', (val) => searchDB(val))
    eyes: Alt.number().integer().positive().max(2)
}).options({
    required: true,
    unknown: false
}).validate({
    login: 'leela',
    email: 'captain@planetexpress.earth',
    eyes: 1
});

console.log(hasError); // false
```


# Api
## Instance
To keep Altheia simple and fast, the lib is not immutable but you can create an instance of altheia to avoid modifying the global object.

```javascript
const Instance = Alt.instance();
```

## Template
When you are manipulating a large api, you can feel you are writing the same validation hover and hover. Templates are a very easy way to reduce redundancy in your code and sync all your schemas, while being very light to use.
N.B: It is only available in instance.

```javascript
const alt = Alt.instance();

alt.template('login', Alt.string().lowercase());
alt.template('password', Alt.string().min(6));


alt({
    login: alt.is('login'),
    password: alt.is('password').required() // keep chainability
})
```


## Methods
- instance()
    + template
    + is
    + options
    + validate
    + all
        * required
        * custom
        * clone
        * validate
    + string()
        * min
        * max
        * pattern
        * in
        * not
        * email
        * lowercase
        * uppercase
    + object()
        * in
    + date()
        * iso
    + number()
        * min
        * max
        * integer
        * unsigned
        * positive
        * negative
