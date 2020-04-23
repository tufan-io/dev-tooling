# Development tooling

The repo comes with tooling pre-configured for most development tasks
for node.js projects built in TypeScript

## Goal

The goal is to be simple, lean and automated.

- minimize dependencies.
- use simpler-to-understand dependencies when necessary.
- enable a move-fast mindset.

Support for the following is baked in:

- [x] [tslint](https://github.com/palantir/tslint)
- [x] build automation
- [x] [ava](https://github.com/avajs/ava) test-automation
- [x] test coverage (remapped to TypeScript)
- [x] checks dependencies for known vulnerabilities before commit
- [x] checks for circular-dependencies (via [madge](https://www.npmjs.com/package/madge))
- [x] checks package.json is correct (via [pkg-ok](https://www.npmjs.com/package/pkg-ok))
- [x] checks
- [x] CI integration - using github actions
- [x] Code-of-conduct
- [x] [commitizen](https://www.npmjs.com/package/commitizen) integration

# Pre-requisites
Please ensure you have these dependencies installed globally

1. [git](https://git-scm.com/downloads)
2. [node.js](https://nodejs.org/) (preferrably via [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows))
3. [perl](https://www.perl.org/get.html) (to run [cloc](https://www.npmjs.com/package/cloc))
4. `npm i npm-check -g`
5. `npm i sort-package-json -g`

## DX & minimizing tech-debt

This package take an opinioned view on the Developer-Experience with an eye towards minimizing tech-debt.
There are four operations that will be part of a developer experience:

- `npm build`: cleans, lints, builds and tests with coverage metrics.
- `git cz`: formats commit message to ease generation of Changelogs
- `git push`: a pre-push hook runs coverage-check, checks packages for updates and unpatched vulnerabilities

The process is meant to serve as an early-warning mechanism to catch issues that will cause potentially
expensive mishaps or re-work later in the project life-cycle.

## run-scripts

Since "lean"-ness is a primary goal, npm is used as a build tool.
We use [npm-run-batch](https://github.com/sramam/npm-run-batch) to create
a simple pipeline of tasks to perform for each build step.

### The run-scripts used

*aside:* To help with these, we recommend [npm-completion](https://docs.npmjs.com/cli/completion)

    build       : builds the project
    compile     : only compiles the project
    clean       : removes all artifacts generated during build
    build:watch : watch project files and rebuild when anything changes
    lint        : runs tslint, to find common formatting errors and then some
    test        : runs tests with coverage on generated JavaScript

## Project Structure

The directory structure of a typical project:

    ├── LICENSE
    ├── README.md
    ├── package.json
    ├── scripts/              - post install scripts
    ├── src/                  - module source (TypeScript)
    │   ├── test/
    │   │   └── specs/
    │   │       └── index.ts
    │   └── index.ts
    ├── docs/                 - module documentation
    ├── tsconfig.dist.json    - production tsconfig
    ├── tsconfig.json         - development tsconfig
    └── tslint.json           - tslint

In addition, these directories are auto-created by the various scripts.
The coverage & build directories are .gitignored.
By design, dist directories are commited to the repo. For components
with non-native dependencies, which is a vast majority of the cases,
this is an advantage, since it minimizes the module size for download
and makes the build setup a lot simpler.

If your module includes native/compiled artifacts, this might need to be
reconsidered.

    ├── coverage/
    |   └── typescript/
    |       └── index.html    - html report of typescript
    └── dist/                 - Commmitted to repo. Minimizes package size
