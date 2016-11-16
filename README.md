
# GRANTURISMO

generator tool

## PUBLISH

make sure you have submitted your changes

`npm version patch`

`npm publish --registry="https://registry.npmjs.org/"`

## ENCOUNTERED PROBLEMS

- npm postinstall scripts running by nobody, cannot write files in file system.

    @see http://stackoverflow.com/questions/25011703/write-file-in-home-directory-when-running-npm-install
    
    when running `gt init`, user is current login user (whoami === 'vivaxy'), whence we can write files.

## REFERENCE

- https://github.com/jprichardson/node-fs-extra
- https://github.com/shelljs/shelljs
- https://github.com/yargs/yargs
