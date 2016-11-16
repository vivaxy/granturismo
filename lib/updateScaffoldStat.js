/**
 * @since 2016-11-16 11:40
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

import { GTHome } from '../config';

export default (scaffoldName) => {
    const userConfigFile = path.join(GTHome, `config.json`);
    const userConfig = require(userConfigFile);

    userConfig.scaffold[scaffoldName].stat = userConfig.scaffold[scaffoldName].stat + 1;
    fse.outputJsonSync(userConfigFile, userConfig);
};
