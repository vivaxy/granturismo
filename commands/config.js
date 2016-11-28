/**
 * @since 2016-11-16 16:45
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';
import columnify from 'columnify';

import * as configManager from '../lib/configManager';
import { GTHome } from '../config';

const ADD = `add`;
const REMOVE = `remove`;
const LIST = `list`;

const acceptedAction = [ADD, REMOVE, LIST,];

const help = () => {
    console.log(`
usage: gt config

    gt config list
    gt config add [scaffold] [url]
    gt config remove [scaffold]
`);
    return false;
};

const editConfig = async(filter) => {
    const config = configManager.read();
    const updatedUserConfig = await filter(config);
    await configManager.write(updatedUserConfig);
};

const add = async(scaffoldName, ...restArgs) => {
    const repo = restArgs.shift();
    if (repo) {
        await editConfig((userConfig) => {
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

const remove = async(scaffoldName) => {
    await editConfig(async(userConfig) => {
        const newConfig = Object.assign({}, userConfig);
        delete newConfig.scaffold[scaffoldName];
        await fsp.remove(path.join(GTHome, scaffoldName));
        return newConfig;
    });
};

const list = () => {
    const userConfig = configManager.read().scaffold;
    const scaffoldList = configManager.readScaffoldListByStatOrder();
    const data = scaffoldList.map((scaffold) => {
        return {
            stat: userConfig[scaffold].stat,
            name: scaffold,
            repo: userConfig[scaffold].repo,
        };
    });
    console.log(columnify(data));
};

const doAction = async(action, ...restArgs) => {

    const scaffoldName = restArgs.shift();
    switch (action) {
        case ADD:
            await add(scaffoldName, ...restArgs);
            break;
        case REMOVE:
            await remove(scaffoldName, ...restArgs);
            break;
        case LIST:
            list();
            break;
        default:
            throw new Error(`gt config ${action} not found`);
            break;
    }
};

export default async(...restArgs) => {

    const action = restArgs.shift();
    if (acceptedAction.indexOf(action) === -1) {
        help();
    } else {
        await doAction(action, ...restArgs);
    }
};
