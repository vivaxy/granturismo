/**
 * @since 2016-11-16 11:40
 * @author vivaxy
 */

import * as configManager from './configManager';

export default async(scaffoldName) => {
    const userConfig = configManager.read();
    userConfig.scaffold[scaffoldName].stat = userConfig.scaffold[scaffoldName].stat + 1;
    await configManager.write(userConfig);
};
