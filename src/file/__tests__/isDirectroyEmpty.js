import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import isDirectoryEmpty from '../isDirectoryEmpty';

test('should tell if a directory is empty or not', async(t) => {
    // not empty
    const result1 = await isDirectoryEmpty(path.join(__dirname, 'fixtures'));
    t.is(result1, false);

    // not empty
    const result2 = await isDirectoryEmpty(path.join(__dirname, 'fixtures'), ['empty-dir']);
    t.is(result2, false);

    // is empty
    const result3 = await isDirectoryEmpty(path.join(__dirname, 'fixtures'), ['.gitkeep']);
    t.is(result3, true);

    // is empty
    const testDirectory4 = path.join(__dirname, 'fixtures', 'empty-dir');
    await fse.ensureDir(testDirectory4);
    const result4 = await isDirectoryEmpty(testDirectory4);
    t.is(result4, true);
    await fse.remove(testDirectory4);

    // is not a dir
    t.throws(isDirectoryEmpty(path.join(__dirname, 'fixtures', '.gitkeep')));
    t.throws(isDirectoryEmpty(path.join(__dirname, 'fixtures', 'empty-dir')));
});
