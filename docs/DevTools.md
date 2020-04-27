# Development tooling

A batteries included development tool-chain that can be installed over an existing node-module.
Designed for use in the context of TypeScript+node.js projects. In other cases, YMMV.

## Goal

The goal is to be simple, lean and automated.

- minimize dependencies.
- use simpler-to-understand dependencies when necessary.
- enable a move-fast mindset.

Support for the following is baked in:

- [x] [tslint](https://github.com/palantir/tslint) (move to eslint TODO)
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
4. `npm i npm-check -g` (to selectively update dependencies)
5. `npm i git-cz -g` (to help create correctly formatted commit messages)

## DX & minimizing tech-debt

This package take an opinioned view on the Developer-Experience with an eye towards minimizing tech-debt.
There are four operations that will be part of a developer experience:

- `npm build`: cleans, lints, builds and tests with coverage metrics
- `git cz`: formats commit message to ease generation of Changelogs
- `git push`: a pre-push hook runs coverage-check, checks for vulnerabilities in dependencies
- `npm-check -u`: allows user to select among modules to update

The process is meant to serve as an early-warning mechanism to catch issues that will cause potentially
expensive mishaps or re-work later in the project life-cycle.

## run-scripts
We use [npm-run-batch](https://github.com/sramam/npm-run-batch) to create
a simple pipeline of tasks to perform for each build step.

### Simple Development workflow

    compile       : only compiles the project
    test-no-cover : run tests defined in ./dist/**/test/*.js, without coverage
    ---
    qt            : an alias to run `compile` & `test-no-cover`

### Full build Seqeunce

    format            : auto format the code
    lint              : tslint src dir
    clean             : delete all generated artifacts
    compile           : compile ./src
    test              : run tests defined in ./dist/**/test/*.js, with coverage
    no-circular-deps  : check to ensure no circular dependencies
    cloc              : generate a line-count report (console & markdown)
    todos             : generate a TODO list to console (uses leasot)
    todos-md          : generate docs/TODOs.md (uses leasot)

### Commit & Push workflow

With simple commit messages (1-2 lines)

    npm run build      # (runs the sequence above)
    git add .
    git cz             # pre-commit-hook flow (see package.json) + interactive prompt
    git push           # pre-push-hook flow (see package.json)

With large commit messages, when an editor would be useful

    npm run build      # (runs the sequence above)
    git add .
    git commit         # pre-commit-hook flow (see package.json) + editor for messages
    git push           # pre-push-hook flow (see package.json)

### Publish workflow
Since we enforce commitzen standard commit messages, it's now time to reap the benefits.
`simple-ci` makes it easy to follow [commitizen recommendation](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli#with-npm-version)

Before deciding the publish a version, it's important to
1. have a passing build at this point.
2. commit all modifications.
3. Prudent to ensure all changes are push to remote
4. The CI build is passing all checks.

Effectively, it's as simple as:

    version [patch|minor|major]
    publish

In reality, we use `run-scripts` to accomplish the following sequence:

    # preversion
      git fetch --all --tags
      conventional-changelog -p angular -i docs/CHANGELOG.md -s
      git add CHANGELOG.md
    npm version patch # bumps version number and creates a commit, including changelog
    npm publish
    # postpublish
      git push
      git push origin --tags

Currently, we rely on the user to determine whether it is a patch/minor/major version. Which prevents futher automation.


### Dependency upgrades
Since we are in the business of building many small modules, keeping up with the
frequent upgrades in dependencies is a significant problem. Many a time, one
can ignore upgrades, till a security issue is flagged. Given the pace at which
things advance in JavaScript land, it's equally likely that the fix is so far
downstream, that a stale depenendecy list causes significant pain of upgrade.

`simple-ci` was designed to remove such pain. So it makes the most sense to make
dependency upgrades a simple process.

Since we use github, it's a possibility to use github provided `dependabot` to perform the upgrades. `dependabot` is however a pain in that it upgrades one
dependency at a time, and generates three emails per dependency. It's not uncommon to have 30+ notifications at 4:00 am from your git repo. `dependabot` helpfully rinses and repeats this process every week or two!

We aim to quell the noise, by combining all the dependency upgrades into one step. If an attempt should fail, it requires human interaction anyway.

This is getting a bit long in the tooth - `simple-ci` provides a single run-script: `dependency-upgrade` which attempts to collapse all this work into a single commit-message. While it's not triggered by a gh-action yet, a future upgrade
to `simple-ci` will accomplish that.

## Project Structure

Typical project structure is shown below.
By design, the dist directory is committed to version control.
This allows using git urls as installation targets when necessary.

```
(* = dir|file generated with every build)

    ├── .github/
    │   └── workflows/
    │       └── action-ci.yml
    ├── .gitignore
    ├── .npmignore
    ├── .npmrc
    ├── .vscode/
    ├── LICENSE
    ├── README.md
    ├── SECURITY.md
    ├── dist*/                - compiled output, mirrors src
    ├── docs/                 - reports & documentation
    │   ├── CHANGELOG.md*
    │   ├── DevTools.md
    │   ├── TODOs.md*
    │   ├── cloc.md*
    │   ├── cloc.report*
    │   └── code-of-conduct.md
    ├── package-lock.json
    ├── package.json
    ├── src/                  - module source (TypeScript)
    │   ├── test/             - (skipped for coverage computation)
    │   │   ├── fixtures/     - fixtures for test
    │   │   ├── helpers/      - helper code for writing tests
    │   │   └── index.ts      - test file (ava.js)
    │   ├── utils/            - utils needed by module source
    │   └── index.ts          - source file
    ├── tsconfig.json
    └── tslint.json
```
