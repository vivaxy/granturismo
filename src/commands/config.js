/**
 * @since 2016-11-16 16:45
 * @author vivaxy
 */

import yargs from 'yargs';
import path from 'path';
import fse from 'fs-extra';
import columnify from 'columnify';

import * as configManager from '../lib/configManager';
import { GT_HOME } from '../config';

const ADD = 'add';
const REMOVE = 'remove';
const LIST = 'list';

const acceptedAction = [ADD, REMOVE, LIST];

const editConfig = async(filter) => {
    const config = configManager.read();
    const updatedUserConfig = await filter(config);
    await configManager.write(updatedUserConfig);
};

const add = async(argv) => {
    const scaffoldName = argv.name;
    const repo = argv.repo;
    if (repo) {
        await editConfig((userConfig) => {
            let stat = 0;
            if (userConfig.scaffold[scaffoldName]) {
                stat = userConfig.scaffold[scaffoldName].stat;
            }
            const newConfig = Object.assign({}, userConfig);
            newConfig.scaffold[scaffoldName] = { repo, stat };
            return newConfig;
        });
    } else {
        yargs.showHelp();
    }
};

const remove = async(argv) => {
    const scaffoldName = argv.name;
    await editConfig(async(userConfig) => {
        const newConfig = Object.assign({}, userConfig);
        delete newConfig.scaffold[scaffoldName];
        await fse.remove(path.join(GT_HOME, scaffoldName));
        return newConfig;
    });
};

const list = () => {
    const userConfig = configManager.read().scaffold;
    const scaffoldList = configManager.readScaffoldListByStatOrder();
    const data = scaffoldList.map((scaffold) => {
        return { stat: userConfig[scaffold].stat, name: scaffold, repo: userConfig[scaffold].repo };
    });
    console.log(columnify(data)); // eslint-disable-line no-console
};

const doAction = async(argv) => {
    const action = argv.command;
    switch (action) {
        case ADD:
            await add(argv);
            break;
        case REMOVE:
            await remove(argv);
            break;
        case LIST:
            list();
            break;
        default:
            throw new Error(`gt config ${action} not found`);
    }
};

export const command = 'config <command> [name] [repo]';
export const describe = 'Show or edit configs';
export const builder = {};
export const handler = async(argv) => {
    const action = argv.command;
    if (acceptedAction.indexOf(action) === -1) {
        yargs.showHelp();
    } else {
        await doAction(argv);
    }
};
