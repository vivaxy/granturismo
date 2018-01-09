/**
 * @since 20180109 14:56
 * @author vivaxy
 */

import getInfoFromShell from '../lib/getInfoFromShell';

export default async() => {
    return await getInfoFromShell('git', ['rev-parse', 'HEAD']);
};
