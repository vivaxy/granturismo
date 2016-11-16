/**
 * @since 2016-11-15 21:31
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';
import sh from 'shelljs';

import { GTHome } from '../config';
import config from '../config/config.json';

export default () => {
    const userConfigFile = path.join(GTHome, `config.json`);
    if (!sh.test(`-f`, userConfigFile)) {
        fse.outputJsonSync(userConfigFile, config);
    }
};
