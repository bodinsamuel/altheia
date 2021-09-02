# Contributing

## Dev

```sh
yarn

yarn lint
yarn build
yarn test
```

## Releasing

```sh
GH_TOKEN="token" yarn semantic-release --ci=false
yarn build
yarn publish
```
