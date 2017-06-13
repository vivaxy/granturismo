/**
 * @since 2017-06-13 17:23:47
 * @author vivaxy
 */

import test from 'ava';

import getRemote from '../getRemote';

test('should get remote', async(t) => {
    const result = await getRemote();
    t.is(typeof result, 'string');
});
