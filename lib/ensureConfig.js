/**
 * @since 2016-11-15 21:31
 * @author vivaxy
 */

import * as configManager from './configManager';
import config from '../config/config.json';

export default async() => {
    if (!await configManager.exist()) {
        await configManager.write(config);
    }
};
