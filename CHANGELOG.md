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
