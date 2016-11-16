/**
 * @since 2016-11-16 10:22
 * @author vivaxy
 */

import path from 'path';
import { argv } from 'yargs';
import sh from 'shelljs';
import ensureConfig from '../lib/ensureConfig';

const [command, ...restCommand] = argv._;

const getCommandMethod = (_command) => {
    const commandFile = path.join(__dirname, `..`, `commands`, `${_command}.js`);
    if (sh.test(`-f`, commandFile)) {
        return require(commandFile).default;
    } else {
        return null;
    }
};

ensureConfig();

const commandMethod = getCommandMethod(command);
if (commandMethod) {
    commandMethod(...restCommand);
} else {
    const help = getCommandMethod(`help`);
    help();
}
