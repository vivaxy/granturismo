/**
 * @since 20180302 12:35
 * @author vivaxy
 */
import * as logger from '../../lib/logger';
import { editConfig } from '../../lib/configManager';

export const command = 'add [name] [repo]';
export const describe = 'Add a config';
export const builder = {
    name: {
        demandOption: true,
        describe: 'Scaffold name',
        type: 'string',
    },
    repo: {
        demandOption: true,
        describe: 'Repository URL',
        type: 'string',
    },
};
export const handler = async({ name: scaffoldName, repo }) => {
    if (repo) {
        await editConfig((userConfig) => {
            const { stat = 0 } = userConfig.scaffold[scaffoldName] || {};
            const newConfig = Object.assign({}, userConfig);
            newConfig.scaffold[scaffoldName] = { repo, stat };
            return newConfig;
        });
        logger.success(`Scaffold \`${scaffoldName}\` at \`${repo}\` added.`);
    }
};
