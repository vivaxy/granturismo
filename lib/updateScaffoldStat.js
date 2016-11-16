/**
 * @since 2016-11-16 11:40
 * @author vivaxy
 */

import fse from 'fs-extra';

import { GTHome } from '../config';

export default (scaffoldName) => {
    const userConfigFile = path.join(GTHome, `config.json`);
    const userConfig = require(userConfigFile);

    userConfig[scaffoldName].stat = userConfig[scaffoldName].stat + 1;
    fse.outputJsonSync(userConfigFile, userConfig);
};
