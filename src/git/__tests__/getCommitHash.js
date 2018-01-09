/**
 * @since 20180109 14:57
 * @author vivaxy
 */

import test from 'ava';
import getCommitHash from '../getCommitHash';

test('should get commit hash', async(t) => {
    const result = await getCommitHash();
    t.is(typeof result, 'string');
    t.is(result.includes('\n'), false);
    t.is(result.length, 40);
});
