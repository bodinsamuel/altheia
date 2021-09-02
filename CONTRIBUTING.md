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
git pull --rebase

GH_TOKEN="token" yarn semantic-release
git push --tags
yarn build
yarn publish
```
