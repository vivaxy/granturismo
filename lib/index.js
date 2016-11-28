/**
 * @since 2016-11-16 10:22
 * @author vivaxy
 */

import path from 'path';
import { argv } from 'yargs';

import fileExists from '../lib/fileExists';
import ensureConfig from '../lib/ensureConfig';

const [command, ...restCommand] = argv._;

const getCommandMethod = async(_command) => {
    const commandFile = path.join(__dirname, `..`, `commands`, `${_command}.js`);
    const commandFileExists = await fileExists(commandFile);
    if (commandFileExists) {
        return require(commandFile).default;
    } else {
        return null;
    }
};

const main = async() => {

    await ensureConfig();

    const commandMethod = await getCommandMethod(command);
    if (commandMethod) {
        await commandMethod(...restCommand);
    } else {
        const help = await getCommandMethod(`help`);
        await help();
    }
};

main();
