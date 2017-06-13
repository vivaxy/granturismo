/**
 * @since 2017-06-13 17:25:47
 * @author vivaxy
 */


import test from 'ava';

import getRemoteURL from '../getRemoteURL';

test('should get remote url', async(t) => {
    const result = await getRemoteURL();
    t.is(typeof result, 'string');
});
