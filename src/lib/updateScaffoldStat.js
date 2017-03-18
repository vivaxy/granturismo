/**
 * @since 2016-11-16 11:40
 * @author vivaxy
 */

import * as configManager from './configManager';

export default async(scaffoldName) => {
    const userConfig = configManager.read();
    userConfig.scaffold[scaffoldName].stat++;
    await configManager.write(userConfig);
};
