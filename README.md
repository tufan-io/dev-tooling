# @tufan-io/dev-tooling

[![Build status](https://tufan-io.github.io/dev-tooling/ci/badge/build.svg)](https://github.com/tufan-io/dev-tooling/actions)

Standardized development tooling for tufan.io (node.js) projects.

`tufan.io` is a primarily TypeScript dev shop.
The growing sophistication of tufan.io's development process, has resulted in an
unexpected pain point - keeping the scores of modules in-sync as the individual
tools used expand and evolve.

This is meant to be a single module that standardizes tufan.io development tooling.
Importantly, it brings it under the semver management via npm.

The module uses a script to be run post-installation, and makes inplace modification
to the dependent module. Specifically:

- package.json,
- README
- LICENSE
- code-of-conduct.md
- tsconfig.json,
- tslint.json,
- .github/workflows/simple-ci.yml
- .gitignore
- .npmignore
- .npmrc
- .editorconfig
- docs/DevTools.md
- .vscode/launch.json
- .vscode/settings.json
- .vscode/tasks.json

The post install script aims to be curteous and will seek permission, and where
possible display changes to be made, before actually making them. For the moment,
that is an aspirational goal.

## Usage
Set registry config
```bash
npm config set @tufan-io:registry https://npm.pkg.github.com/tufan-io
```

Install the package
```bash
npm install @tufan-io/dev-tooling --save-dev
```

## Development Tooling
- [Development tooling](./docs/DevTools.md)
- [CLOC reports](./docs/cloc.md)
- [TODOS](./docs/TODOs)
- [Changelog](./CHANGELOG.md)

## License
[Apache-2.0](./LICENSE.md)

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Support
Bugs, PRs, comments, suggestions welcomed!
