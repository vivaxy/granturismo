#!/usr/bin/env node

/**
 * @since 2016-11-16 10:21
 * @author vivaxy
 */

const path = require('path');

require('babel-polyfill');
// http://stackoverflow.com/questions/35120305/using-babel-register-in-my-cli-npm-app-works-locally-but-not-globally-after-pub/35120765#35120765
require('babel-register')({
    ignore: (filename) => {
        const ignorePath = path.join(__dirname, `node_modules`);
        const ignored = filename.indexOf(ignorePath) > -1;
        // console.log(filename, ignored);
        return ignored;
    },
});
require('./lib/main');
