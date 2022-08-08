## [5.0.15](https://github.com/bodinsamuel/altheia/compare/v5.0.14...v5.0.15) (2022-08-08)


### Bug Fixes

* dependencies 2022-07-31 ([#743](https://github.com/bodinsamuel/altheia/issues/743)) ([72b945b](https://github.com/bodinsamuel/altheia/commit/72b945b2cf4fa404533d518cf876daacbf58a3ec)), closes [#744](https://github.com/bodinsamuel/altheia/issues/744) [#745](https://github.com/bodinsamuel/altheia/issues/745) [#746](https://github.com/bodinsamuel/altheia/issues/746) [#747](https://github.com/bodinsamuel/altheia/issues/747) [#752](https://github.com/bodinsamuel/altheia/issues/752) [#753](https://github.com/bodinsamuel/altheia/issues/753) [#748](https://github.com/bodinsamuel/altheia/issues/748) [#749](https://github.com/bodinsamuel/altheia/issues/749) [#750](https://github.com/bodinsamuel/altheia/issues/750) [#751](https://github.com/bodinsamuel/altheia/issues/751) [#755](https://github.com/bodinsamuel/altheia/issues/755)
* dependencies 2022-08-07 ([#756](https://github.com/bodinsamuel/altheia/issues/756)) ([02b94bf](https://github.com/bodinsamuel/altheia/commit/02b94bfb0b4de44282385bdb58f7141ce00b5327)), closes [#757](https://github.com/bodinsamuel/altheia/issues/757) [#758](https://github.com/bodinsamuel/altheia/issues/758) [#759](https://github.com/bodinsamuel/altheia/issues/759) [#763](https://github.com/bodinsamuel/altheia/issues/763) [#764](https://github.com/bodinsamuel/altheia/issues/764) [#765](https://github.com/bodinsamuel/altheia/issues/765) [#762](https://github.com/bodinsamuel/altheia/issues/762) [#761](https://github.com/bodinsamuel/altheia/issues/761)

## [5.0.14](https://github.com/bodinsamuel/altheia/compare/v5.0.13...v5.0.14) (2022-07-26)


### Bug Fixes

* dependencies 2022-07-28 ([#728](https://github.com/bodinsamuel/altheia/issues/728)) ([3b3045d](https://github.com/bodinsamuel/altheia/commit/3b3045d38db10adeca31fe5ca65746adeeb0a133))
* dependencies 2022-07-29 ([#735](https://github.com/bodinsamuel/altheia/issues/735)) ([c03fc2d](https://github.com/bodinsamuel/altheia/commit/c03fc2df1c689edb085c32dc9f221d0e07d091c7))
* update node ([#734](https://github.com/bodinsamuel/altheia/issues/734)) ([1a8de05](https://github.com/bodinsamuel/altheia/commit/1a8de05aa6430029df92f070f673fe9be56d8e0a))

## [5.0.13](https://github.com/bodinsamuel/altheia/compare/v5.0.12...v5.0.13) (2022-01-17)


### Bug Fixes

* upgrade dependencies ([4c3f2a8](https://github.com/bodinsamuel/altheia/commit/4c3f2a85c0abd347f5625d6a3b03e32ca2872e6d))

## [5.0.12](https://github.com/bodinsamuel/altheia/compare/v5.0.11...v5.0.12) (2021-09-02)


### Bug Fixes

* **deps:** upgrade everything ([4c40c72](https://github.com/bodinsamuel/altheia/commit/4c40c72f93039e3e9524c8a82d911e22c889f4c9))
* add semantic-release ([7a022f6](https://github.com/bodinsamuel/altheia/commit/7a022f6efac132bb4189013af86dfeb3c273fd8d))
* oneOf param in doc ([#552](https://github.com/bodinsamuel/altheia/issues/552)) ([2de610a](https://github.com/bodinsamuel/altheia/commit/2de610a507719feb03c21e32620c5ebd1af6b22a))
* **ci:** use github actions ([#582](https://github.com/bodinsamuel/altheia/issues/582)) ([05c604e](https://github.com/bodinsamuel/altheia/commit/05c604e5db0f156c519d04e8de26d835d07b03aa))

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
