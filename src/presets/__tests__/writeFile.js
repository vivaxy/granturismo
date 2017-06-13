/**
 * @since 2017-06-13 17:42:30
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import options from './helpers/options';
import createWriteFile from '../writeFile';

test('should write file', async(t) => {
    const filename = 'test-filename';
    const fileContent = 'test-file-content';
    const writeFile = createWriteFile(options);
    await writeFile(filename, fileContent);
    const expectedFileContent = await fse.readFile(path.join(options.project.folder, filename), 'utf8');
    t.is(fileContent, expectedFileContent);
});
