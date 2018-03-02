/**
 * @since 20180302 12:40
 * @author vivaxy
 */
import path from 'path';
import fse from 'fs-extra';

import { editConfig } from '../../lib/configManager';
import * as logger from '../../lib/logger';
import { GT_HOME } from '../../config';

export const command = 'remove [name]';
export const describe = 'Remove a config';
export const builder = {
    name: {
        demandOption: true,
        describe: 'Scaffold name',
        type: 'string',
    },
};
export const handler = async({ name: scaffoldName }) => {
    let repo = null;
    await editConfig(async(userConfig) => {
        const newConfig = Object.assign({}, userConfig);
        if (!newConfig.scaffold[scaffoldName]) {
            logger.info(`Scaffold \`${scaffoldName}\` not exists.`);
            return userConfig;
        }
        repo = newConfig.scaffold[scaffoldName].repo;
        delete newConfig.scaffold[scaffoldName];
        await fse.remove(path.join(GT_HOME, scaffoldName));
        logger.success(`Scaffold \`${scaffoldName}\` at \`${repo}\` removed.`);
        return newConfig;
    });
};
