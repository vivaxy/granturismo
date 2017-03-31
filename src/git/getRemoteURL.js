/**
 * @since 2017-03-31 13:54:02
 * @author vivaxy
 */

import getInfoFromShell from '../lib/getInfoFromShell';
import getGitRemote from './getRemote';

export default async() => {
    const remote = await getGitRemote();
    return await getInfoFromShell('git', ['remote', 'get-url', remote]);
};
