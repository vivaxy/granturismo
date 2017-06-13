/**
 * @since 2017-06-13 17:28:03
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import options from './helpers/options';
import createCopyFiles from '../copyFiles';
import fileExists from '../../file/fileExists';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should copy files', async(t) => {
    const files = ['package.json'];
    const copyFiles = createCopyFiles(options);
    await copyFiles(files);
    const results = await Promise.all(files.map((filename) => {
        return fileExists(path.join(options.project.folder, filename));
    }));
    t.true(results.every((value) => {
        return value;
    }));
});
