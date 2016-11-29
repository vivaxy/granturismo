/**
 * @since 2016-11-16 10:22
 * @author vivaxy
 */

import yargs from 'yargs';

import ensureConfig from '../lib/ensureConfig';

const configureYargs = () => {
    return yargs
        .commandDir(`../commands`)
        .help()
        .version()
        .argv._;
};

const main = async() => {

    configureYargs();

    await ensureConfig();

};

main();
