/**
 * @since 2016-11-16 16:45
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';
import columnify from 'columnify';

import * as configUtil from '../lib/configUtil';
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

const editConfig = (filter) => {
    const config = configUtil.read();
    const updatedUserConfig = filter(config);
    configUtil.write(updatedUserConfig);
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
        fse.removeSync(path.join(GTHome, scaffoldName));
        return newConfig;
    });
};

const list = () => {
    const userConfig = configUtil.read().scaffold;
    const scaffoldList = configUtil.readScaffoldListByStatOrder();
    const data = scaffoldList.map((scaffold) => {
        return {
            stat: userConfig[scaffold].stat,
            name: scaffold,
            repo: userConfig[scaffold].repo,
        };
    });
    console.log(columnify(data));
};

const doAction = (action, ...restArgs) => {

    const scaffoldName = restArgs.shift();
    switch (action) {
        case ADD:
            add(scaffoldName, ...restArgs);
            break;
        case REMOVE:
            remove(scaffoldName, ...restArgs);
            break;
        case LIST:
            list();
            break;
        default:
            throw new Error(`gt config ${action} not found`);
            break;
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
