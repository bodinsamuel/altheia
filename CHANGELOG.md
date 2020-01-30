# Changelog

## [5.0.2](https://github.com/bodinsamuel/altheia/compare/v5.0.0...master) (2020-01-31)

### Features

- `Object.anyOf()` Force one or many keys to be present

## [5.0.0](https://github.com/bodinsamuel/altheia/compare/v5.0.0...master) (2019-08-01)

New online documentation:
[https://bodinsamuel.github.io/altheia/](https://bodinsamuel.github.io/altheia/)

### Breaking

- Rewrite in Typescript
- NodeJs support: 8 >=
- Syntax ES6+
- Now use yarn
- `Object().schema()` old syntax no longer accepted.
  Please use `schema(schema, { returnErrors = true })`
- All tests should now return `{ valid: boolean; error: string } | boolean`
- `alt.option()` **unknown** is now `true` by default
- Types `.validate(<value>)` now return `{ type, valid, result? }`
  - **name** has been renamed type
  - **isValid** has been renamed valid
    Please refer to typescript definition to see full object

### Features

- `alt.validate()` can now take a body directly `alt.validate({ my: 'body' })`; old syntax `alt.body({ my: 'body' }).validate()` still work.

## [4.0.0](https://github.com/bodinsamuel/altheia/compare/v4.0.0...master) (2018-11-20)

### Breaking

- Alt(...).validate() can not be called twice, you need to `clone()` [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#clone)

## [3.3.0](https://github.com/bodinsamuel/altheia/compare/v3.2.0...master) (2018-11-19)

### Features

- Object.schema(): now `returnErrors=true` by default

## [3.2.0](https://github.com/bodinsamuel/altheia/compare/v3.2.0...master) (2018-11-19)

### Features

- Object.in(): signature change (retro-compatible) with new option `oneErrorPerKey` [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#invalue--options-object)

## [3.1.1](https://github.com/bodinsamuel/altheia/compare/v3.1.0...master) (2018-11-06)

- Update dependencies

## [3.1.0](https://github.com/bodinsamuel/altheia/compare/v3.1.0...master) (2018-10-03)

### Features

- Array.oneOf(): [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#oneoftemplates)

### Updates

- Update dependencies
- Add comments everywhere and enforce jsdoc with eslint
- All tests can now return an array of errors { isValid, error, **errors** }.
  This allow returning nested error.

## [3.0.0](https://github.com/bodinsamuel/altheia/compare/v3.0.0...master) (2018-08-01)

### Features

- New plugin: [Function](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#function)
- New plugin: [Any](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#any)
- Object.oneOf(): [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#oneofisonerequired-boolean-keys-string)
- Object.allOf(): [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#allofkeys-string)

### Updates

- `Object.schema({ schema, returnErrors })` signature is now `Object.schema(schema, { returnErrors })` (old syntax is still accepted)

### Breaking Changes

- All tests (and .custom()) must return either a boolean or a valid object { isValid, error }.
  This allow returning custom error and argument to change the error message and be more strict about what is a succesful test.
  If your `custom()` call is returning something else (string, number ...) an error will be thrown.

## [2.1.0](https://github.com/bodinsamuel/altheia/compare/v2.1.0...master) (2018-06-15)

### Features

- New plugin: [Boolean](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#boolean)
