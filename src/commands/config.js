/**
 * @since 2016-11-16 16:45
 * @author vivaxy
 */

import yargs from 'yargs';

export const describe = 'Show or edit configs';
export const builder = () => {
    return yargs.commandDir('./config-commands');
};
export const handler = () => {};
