# @tufan-io/simple-ci

[![action-ci](https://github.com/tufan-io/simple-ci/workflows/action-ci/badge.svg)](https://github.com/tufan-io/simple-ci/actions)

Standardized development tooling for tufan.io (node.js) projects.

## Usage

```bash
# set registry config
npm config set @tufan-io:registry https://npm.pkg.github.com/tufan-io

# install the package
npm install @tufan-io/simple-ci --save-dev

# configure simple-ci -
#  - an interactive prompt to seek minimal information
#  - uses these answers to make modifications mentioned above
npx simple-ci config
# `npm simple-ci config --help` for details

```

## Why?
`tufan.io` is a primarily TypeScript dev shop.
The growing sophistication of tufan.io's development process, has resulted in an
unexpected pain point - keeping the scores of modules in-sync as the individual
tools used expand and evolve.

This is meant to be a single module that standardizes tufan.io development tooling.
Importantly, it brings it under the semver management via npm.

The module uses a script to be run post-installation, and makes inplace modification
to the dependent module. Specifically:

    ├── .editorconfig
    ├── .github
    │   └── workflows
    │       └── action-ci.yml
    ├── .gitignore
    ├── .npmignore
    ├── .npmrc
    ├── .vscode
    │   ├── launch.json
    │   ├── settings.json
    │   └── tasks.json
    ├── LICENSE
    ├── README.md
    ├── SECURITY.md
    ├── docs
    │   ├── DevTools.md
    │   └── code-of-conduct.md
    ├── package.json       (partial overwirte)
    ├── src                (optional - only when absent, to allow run-scripts to work)
    │   ├── index.ts        ...
    │   └── test            ...
    │       └── index.ts    ...
    ├── tsconfig.json
    └── tslint.json

These files, with the exception of `./src/*` and parts of `package.json`,  are
designed to be managed by `simple-ci`. Meaning a flow of:

     npm up @tufan-io/simple-ci
     npx simple-ci config

Will result in all ther files being overwritten. It's best to log issues against
`simple-ci` for changes you want to be widely available. Any other changes will
have to be manually managed in conjunction with `git diff`.

## Development Tooling
- [Development tooling](docs/DevTools.md)
- [CLOC reports](docs/cloc.md)
- [TODOS](docs/TODOs.md)
- [Changelog](CHANGELOG.md)
- [Security](SECURITY.md)

## License
[Apache-2.0](LICENSE.md)

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Support
Bugs, PRs, comments, suggestions welcomed!
