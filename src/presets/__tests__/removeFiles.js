/**
 * @since 2017-06-13 17:32:17
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import options from './helpers/options';
import createCopyFiles from '../copyFiles';
import createRemoveFiles from '../removeFiles';
import fileExists from '../../file/fileExists';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should remove files', async(t) => {
    const files = ['package.json'];
    const copyFiles = createCopyFiles(options);
    const removeFiles = createRemoveFiles(options);
    await copyFiles(files);
    await removeFiles(files);
    const results = await Promise.all(files.map((filename) => {
        return fileExists(path.join(options.project.folder, filename));
    }));
    t.false(results.every((value) => {
        return value;
    }));
});
