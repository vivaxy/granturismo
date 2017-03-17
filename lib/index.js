/**
 * @since 2016-11-16 10:22
 * @author vivaxy
 */

import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';

import ensureConfig from '../lib/ensureConfig';

const configureYargs = () => {
    return yargs
        .commandDir(`../commands`)
        .help()
        .version()
        .argv._;
};

const main = async () => {

    updateNotifier({pkg}).notify();

    await ensureConfig();

    configureYargs();

};

main().catch((ex) => {
    console.error(ex);
});
