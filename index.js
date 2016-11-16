#!/usr/bin/env node

/**
 * @since 2016-11-16 10:21
 * @author vivaxy
 */

const minimatch = require('minimatch');

const minimatchOption = {
    dot: true,
};

require('babel-polyfill');
// http://stackoverflow.com/questions/35120305/using-babel-register-in-my-cli-npm-app-works-locally-but-not-globally-after-pub/35120765#35120765
require('babel-register')({
    ignore: (filename) => {
        // ignore **/node_modules/granturismo/node_modules/**
        // not ignore **/node_modules/granturismo/**
        // ignore **/node_modules/**
        if (minimatch(filename, `**/node_modules/granturismo/node_modules/**`, minimatchOption)) {
            return true;
        }
        if (minimatch(filename, `**/node_modules/granturismo/**`, minimatchOption)) {
            return false;
        }
        if (minimatch(filename, `**/node_modules/**`, minimatchOption)) {
            return true;
        }
        return false;
    },
});
require('./lib/main');
