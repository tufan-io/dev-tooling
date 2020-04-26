#!/usr/bin/env sh

# TODO: automate manual test
mkdir -p /tmp/simple-ci-test
cd /tmp/simple-ci-test && rm -rf .* *
npm init -y
jq 'del(.devDependencies)' package.json
npm install /Users/sramam/trial/poc/meta/meta-tufan-cli/modules/simple-ci -D
npx simple-ci config
