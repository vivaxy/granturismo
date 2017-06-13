/**
 * @since 2017-06-13 17:17:07
 * @author vivaxy
 */

import test from 'ava';

import getClean from '../getClean';

test('should tell if git repository is clean', async(t) => {
    const result = await getClean();
    t.is(typeof result, 'boolean');
});
