/**
 * @since 2016-11-17 11:36
 * @author vivaxy
 */

import path from 'path';
import sh from 'shelljs';
import fse from 'fs-extra';
import { GTHome, CONFIG_FILE_NAME } from '../config';

const userConfigFile = path.join(GTHome, CONFIG_FILE_NAME);

export const read = () => {
    return require(userConfigFile);
};

export const write = (json) => {
    return fse.outputJsonSync(userConfigFile, json);
};

export const exist = () => {
    return sh.test(`-f`, userConfigFile);
};

export const readScaffoldListByStatOrder = () => {
    const userConfig = read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = Object.keys(scaffoldConfig);

    scaffoldNameList.sort((prev, next) => {
        return scaffoldConfig[prev].stat < scaffoldConfig[next].stat;
    });
    return scaffoldNameList;
};
