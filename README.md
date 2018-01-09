# granturismo

![GT](./assets/images/gt.png)

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Conventional Commits][conventional-commits-image]][conventional-commits-url]
[![Codecov][codecov-image]][codecov-url]

Generator Tool

Workflow tool for scaffolding projects.

The streaming scaffold system.

It is easy to learn and easy to use, more efficient.

If you want to use a scaffold, the scaffold should be adapted to gt, but it is much more simpler than [yeoman](http://yeoman.io/).

## Scaffolds

- [vivaxy/gt-react-scaffold](https://github.com/vivaxy/gt-react-scaffold) webpack, babel, react, redux, router...
- [vivaxy/gt-front-end-scaffold](https://github.com/vivaxy/gt-front-end-scaffold) webpack, babel, eslint...
- [vivaxy/gt-node-server](https://github.com/vivaxy/gt-node-server) nodejs server
- [vivaxy/gt-npm-package](https://github.com/vivaxy/gt-npm-package) npm package

## Installation

Make sure your git version >= 2.7.0

Make sure you have installed nodejs

`npm i -g granturismo`

## Usage

`gt`

`gt help`

`gt init`

`gt config list`

`gt config add scaffold-name git-repo`

`gt config remove scaffold-name`

## How to Scaffold Using GT?

Implement `scripts/gt.js`, adding project info into user config.

If `scripts/gt.js`, all files will be copied by default.

See [Scaffolds](#scaffolds) for examples.

### gt.js

If you want to use es6 in `gt.js`, please use `babel-register` or babel-built js.

```js
// using `babel-register`
if (!global._babelPolyfill) {
    require('babel-polyfill');
}
require('babel-register');
module.exports = require('./gt/index');
```

GT cli invokes methods in `scaffold/scripts/gt.js`, and passing options into `init`.

```js
// gt.js
/**
 * `ask` will be invoked first
 * prompt questions
 * `config` returned will be passed into `init` and `after` by `options.config`
 */, 
export const ask = async(options) => {
    return config;
};
export const init = async(options) => {
    
};
export const after = async(options) => {
    
};
```

```js
// options
{
    project: {
        folder: '/absolute/path/to/project/folder',
        name: 'project-name', // same as project folder name
        git: {
            repositoryURL: 'git://git-url', // mainly used for package.json repository.url
            username: 'vivaxy', // git configured username
        },
    },
    scaffold: {
        folder: '/absolute/path/to/scaffold/folder', // mostly ~/.gt/scaffold-name
        name: 'scaffold-name',
        git: {
            headHash: '23c5742ac306e561554d1cfa56b1618d30d16157',
        },
    },
    presets: {
        copyFiles: async() => {},
        writeFile: async() => {},
        updateFile: async() => {},
        writeJson: async() => {},
        updateJson: async() => {},
        removeFiles: async() => {},
    },
}
```

```js
/**
 * listr context
 * do not modify existing attributes
 * if you want to passing variables in listr context, add a new attribute
 */
{
    selectedScaffoldName,
    selectedScaffoldRepo,
    selectedScaffoldFolder,
    projectGT: {}, // js object required from `./scripts/gt.js`
    GTInfo: {}, // options
}
```

#### presets

##### copyFiles(fileList {Array[String]})

`fileList` `Array[String]` is an array containing filename your want to copy

eg.

```
const copyFiles = async() => {

    const {
        presets,
    } = options;

    const files = [
        `docs`,
        `mock-server`,
        `source`,
        `.babelrc`,
        `.editorconfig`,
        `.gitignore`,
        `LICENSE`,
        `webpack.config.js`,
    ];

    await presets.copyFiles(files);
};
```

##### writeFile(file {String}, content {String})

Write string into file under project folder

##### updateFile(file {String}, filter {Function})

`filter {Function}` `filter(input {String}) => output {String}`

Read file from scaffold, passing into `filter`, write filter result into file under project folder

##### updateFiles(files {Array[String]}, filter {Function})

`filter {Function}` `filter(input {String}) => output {String}`

Read file from scaffold, passing into `filter`, write filter result into file under project folder

##### writeJson(file {String}, json {Object})

Same as `writeFile`, but passing json object into second parameter

##### updateJson(file {String}, filter {Function})

`filter {Function}` `filter(input {Object}) => output {Object}`

Same as `updateFile`, but passing json object into `filter`

##### removeFiles(fileList {Array[String]})

`fileList` `Array[String]` is an array containing filename your want to copy

Same as `copyFiles`, but remove files in project folder

### How to test a scaffold project?

- Checkout a new branch, update your `gt.js`
- Use `gt config add test-scaffold-name git-repo#new-branch-name` to set a test registry.
- `gt init` and select `test-scaffold-name` to run `gt.js` in your new branch to test.

## Change Log

[Change Log](CHANGELOG.md)

## Contributing

[Contributing](CONTRIBUTING.md)

## Prior Art

- [yeoman](http://yeoman.io/)
- [node-scaffold-generator](https://github.com/kaelzhang/node-scaffold-generator)
- [generate](https://github.com/generate/generate)

[travis-image]: https://img.shields.io/travis/vivaxy/granturismo.svg?style=flat-square
[travis-url]: https://travis-ci.org/vivaxy/granturismo
[npm-version-image]: http://img.shields.io/npm/v/granturismo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/granturismo
[npm-downloads-image]: https://img.shields.io/npm/dt/granturismo.svg?style=flat-square
[license-image]: https://img.shields.io/npm/l/granturismo.svg?style=flat-square
[license-url]: LICENSE
[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square
[conventional-commits-url]: https://conventionalcommits.org
[codecov-image]: https://img.shields.io/codecov/c/github/vivaxy/granturismo.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/vivaxy/granturismo
