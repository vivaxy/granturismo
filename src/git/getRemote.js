/**
 * @since 2016-11-28 20:56
 * @author vivaxy
 */

import getInfoFromShell from '../lib/getInfoFromShell';

export default async() => {
    return await getInfoFromShell('git', ['remote']);
};
