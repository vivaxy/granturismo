# granturismo

![GT](./assets/images/gt.png)

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Standard Version][standard-version-image]][standard-version-url]
[![Codecov][codecov-image]][codecov-url]

Generator Tool

Workflow tool for scaffolding projects.

The streaming scaffold system.

It is easy to learn and easy to use, more efficient.

If you want to use a scaffold, the scaffold should be adapted to gt, but it is much more simpler than [yeoman](http://yeoman.io/).

## Scaffolds

- [vivaxy/gt-react-scaffold](https://github.com/vivaxy/gt-react-scaffold) webpack, babel, react, redux, router...
- [vivaxy/gt-front-end-scaffold](https://github.com/vivaxy/gt-front-end-scaffold) webpack, babel, eslint...

## Installation

`sudo npm i -g granturismo`

## Usage

`gt`

`gt help`

`gt init`

`gt config list`

`gt config add scaffold-name git-repo`

`gt config remove scaffold-name`

## How to Scaffold Using GT?

Implement `scripts/gt.js`, adding project info into user config.

See [gt-react-scaffold](https://github.com/vivaxy/gt-react-scaffold/blob/master/scripts/gt.js) and [gt-front-end-scaffold](https://github.com/vivaxy/gt-front-end-scaffold/blob/master/scripts/gt.js) for examples.

### gt.js

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
        },
    },
    scaffold: {
        folder: '/absolute/path/to/scaffold/folder', // mostly ~/.gt/scaffold-name
        name: 'scaffold-name',
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

## Change log

[Change log](CHANGELOG.md)

## Contribute

make sure you have submitted your changes

`npm run release`

## Some Similar Projects

- [yeoman](http://yeoman.io/)
- [node-scaffold-generator](https://github.com/kaelzhang/node-scaffold-generator)

## Encountered Problems

- npm postinstall scripts running by nobody, cannot write files in file system.

    @see http://stackoverflow.com/questions/25011703/write-file-in-home-directory-when-running-npm-install
    
    when running `gt init`, user is current login user (whoami === 'vivaxy'), whence we can write files.

## Reference

- [fs-extra](https://github.com/jprichardson/node-fs-extra)
- [shelljs](https://github.com/shelljs/shelljs)
- [yargs](https://github.com/yargs/yargs)
- [minimatch](https://github.com/isaacs/minimatch)
- [listr](https://github.com/SamVerschueren/listr)
- [fs-promise](https://github.com/kevinbeaty/fs-promise)

[travis-image]: https://img.shields.io/travis/vivaxy/granturismo.svg?style=flat-square
[travis-url]: https://travis-ci.org/vivaxy/granturismo
[npm-version-image]: http://img.shields.io/npm/v/granturismo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/granturismo
[npm-downloads-image]: https://img.shields.io/npm/dt/granturismo.svg?style=flat-square
[license-image]: https://img.shields.io/npm/l/granturismo.svg?style=flat-square
[license-url]: LICENSE
[standard-version-image]: https://img.shields.io/badge/release-standard%20version-brightgreen.svg?style=flat-square
[standard-version-url]: https://github.com/conventional-changelog/standard-version
[codecov-image]: https://img.shields.io/codecov/c/github/vivaxy/granturismo.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/vivaxy/granturismo
