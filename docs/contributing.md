# Contribute to Algolia

## Local installation

```sh
git clone https://github.com/bodinsamuel/altheia.git
```

- **Install:**

```sh
yarn install
```

- **Run test:**

```sh
yarn test
```

- **Lint:**

```sh
yarn lint
```

## Release

```sh
yarn build
```

Write Changelog.md and github release

```sh
yarn version <value>
git add CHANGELOG.md package.json
git push --tags
npm publish
```
