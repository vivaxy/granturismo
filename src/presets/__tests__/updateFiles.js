/**
 * @since 2017-06-13 17:36:41
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import options from './helpers/options';
import createUpdateFiles from '../updateFiles';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should update files', async(t) => {
    const files = ['package.json'];
    const addedContent = ' // new content';
    const updateFiles = createUpdateFiles(options);
    await updateFiles(files, (content) => {
        return content + addedContent;
    });
    const contents = await Promise.all(files.map((file) => {
        return fse.readFile(path.join(options.scaffold.folder, file), 'utf8');
    }));
    const newContents = await Promise.all(files.map((file) => {
        return fse.readFile(path.join(options.project.folder, file), 'utf8');
    }));
    t.true(newContents.every((newContent, index) => {
        return newContent === contents[index] + addedContent;
    }));
});
