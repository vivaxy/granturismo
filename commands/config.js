/**
 * @since 2016-11-16 16:45
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

import { GTHome, CONFIG_FILE_NAME } from '../config';

const ADD = `add`;
const REMOVE = `remove`;

const acceptedAction = [ADD, REMOVE,];

const help = () => {
    console.log(`
    Usage: gt config
     
        gt config add scaffold url
        gt config remove scaffold
`);
    return false;
};

const editConfig = (filter) => {
    const userConfigFile = path.join(GTHome, CONFIG_FILE_NAME);
    const userConfig = require(userConfigFile);
    const updatedUserConfig = filter(userConfig);
    fse.outputJsonSync(userConfigFile, updatedUserConfig);
};

const add = (scaffoldName, ...restArgs) => {
    const repo = restArgs.shift();
    if (repo) {
        editConfig((userConfig) => {
            let stat = 0;
            if (userConfig.scaffold[scaffoldName]) {
                stat = userConfig.scaffold[scaffoldName].stat;
            }
            const newConfig = Object.assign({}, userConfig);
            newConfig.scaffold[scaffoldName] = {
                repo,
                stat,
            };
            return newConfig;
        });
    } else {
        help();
    }
};

const remove = (scaffoldName) => {
    editConfig((userConfig) => {
        const newConfig = Object.assign({}, userConfig);
        delete newConfig.scaffold[scaffoldName];
        return newConfig;
    });
};

const doAction = (action, ...restArgs) => {

    const scaffoldName = restArgs.shift();
    if (action === ADD) {
        add(scaffoldName, ...restArgs);
    }
    if (action === REMOVE) {
        remove(scaffoldName, ...restArgs);
    }
};

export default (...restArgs) => {

    const action = restArgs.shift();
    if (acceptedAction.indexOf(action) === -1) {
        help();
    } else {
        doAction(action, ...restArgs);
    }
};
