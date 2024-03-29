/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: ['main'],
  verifyConditions: ['@semantic-release/github', '@semantic-release/npm'],
  prepare: [
    {
      path: '@semantic-release/changelog',
      changelogFile: 'CHANGELOG.md',
    },
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      assets: ['package.json', 'CHANGELOG.md'],
      message:
        'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    },
  ],
  publish: ['@semantic-release/github', '@semantic-release/npm'],
};
