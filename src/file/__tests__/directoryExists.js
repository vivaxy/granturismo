/**
 * @since 2017-06-13 16:37:12
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';

import directoryExists from '../directoryExists';

test('should tell if a directory exists or not', async(t) => {
    // not exists
    const result1 = await directoryExists(path.join(__dirname, 'fixtures', 'non-exists-directory'));
    t.is(result1, false);

    // exists as a file
    const result2 = await directoryExists(path.join(__dirname, 'fixtures', '.gitkeep'));
    t.is(result2, false);

    // exists as a folder
    const result3 = await directoryExists(path.join(__dirname, 'fixtures'));
    t.is(result3, true);
});
