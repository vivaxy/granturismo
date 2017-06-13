/**
 * @since 2017-06-13 16:44:41
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';

import fileExists from '../fileExists';

test('should tell if a file exists or not', async(t) => {
    // not exists
    const result1 = await fileExists(path.join(__dirname, 'fixtures', 'non-exists-folder'));
    t.is(result1, false);

    // exists as a file
    const result2 = await fileExists(path.join(__dirname, 'fixtures', '.gitkeep'));
    t.is(result2, true);

    // exists as a folder
    const result3 = await fileExists(path.join(__dirname, 'fixtures'));
    t.is(result3, true);
});
