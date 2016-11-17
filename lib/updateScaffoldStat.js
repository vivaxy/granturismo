/**
 * @since 2016-11-16 11:40
 * @author vivaxy
 */

import * as configUtil from '../lib/configUtil';

export default (scaffoldName) => {
    const userConfig = configUtil.read();
    userConfig.scaffold[scaffoldName].stat = userConfig.scaffold[scaffoldName].stat + 1;
    configUtil.write(userConfig);
};
