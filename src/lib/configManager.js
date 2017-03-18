/**
 * @since 2016-11-17 11:36
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';

import fileExists from '../file/fileExists';
import { GT_HOME, CONFIG_FILE_NAME } from '../config';

const userConfigFile = path.join(GT_HOME, CONFIG_FILE_NAME);

export const read = () => {
    return require(userConfigFile); // eslint-disable-line global-require, import/no-dynamic-require
};

export const write = async(json) => {
    return await fsp.outputJson(userConfigFile, json);
};

export const exist = async() => {
    return await fileExists(userConfigFile);
};

export const readScaffoldListByStatOrder = () => {
    const userConfig = read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = Object.keys(scaffoldConfig);

    scaffoldNameList.sort((prev, next) => {
        return scaffoldConfig[next].stat - scaffoldConfig[prev].stat;
    });
    return scaffoldNameList;
};
