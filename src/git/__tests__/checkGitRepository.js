/**
 * @since 2017-06-13 16:53:16
 * @author vivaxy
 */

import test from 'ava';

import checkGitRepository from '../checkGitRepository';

test('should tell if this is a git base folder', async(t) => {
    // in git folder
    const result1 = await checkGitRepository();
    t.true(result1);
});
