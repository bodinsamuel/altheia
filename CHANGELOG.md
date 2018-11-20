# [3.2.1](https://github.com/bodinsamuel/altheia/compare/v3.2.1...master) (2018-11-20)
### Features
- Array.oneOf(): fix error message + add `position` to help identify entry

# [3.2.0](https://github.com/bodinsamuel/altheia/compare/v3.2.0...master) (2018-11-19)
### Features
- Object.in(): signature change (retro-compatible) with new option `oneErrorPerKey` [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#invalue--options-object)

# [3.1.1](https://github.com/bodinsamuel/altheia/compare/v3.1.0...master) (2018-11-06)
- Update dependencies

# [3.1.0](https://github.com/bodinsamuel/altheia/compare/v3.1.0...master) (2018-10-03)
### Features
- Array.oneOf(): [documentation](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#oneoftemplates)

### Updates
- Update dependencies
- Add comments everywhere and enforce jsdoc with eslint
- All tests can now return an array of errors { isValid, error, **errors** }.
  This allow returning nested error.


# [3.0.0](https://github.com/bodinsamuel/altheia/compare/v3.0.0...master) (2018-08-01)


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


# [2.1.0](https://github.com/bodinsamuel/altheia/compare/v2.1.0...master) (2018-06-15)


### Features
- New plugin: [Boolean](https://github.com/bodinsamuel/altheia/blob/master/Documentation.md#boolean)
