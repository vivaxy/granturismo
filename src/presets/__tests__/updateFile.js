/**
 * @since 2017-06-13 17:36:41
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import options from './helpers/options';
import createUpdateFile from '../updateFile';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should update file', async(t) => {
    const file = 'package.json';
    const addedContent = ' // new content';
    const updateFile = createUpdateFile(options);
    await updateFile(file, (content) => {
        return content + addedContent;
    });
    const content = await fse.readFile(path.join(options.scaffold.folder, file), 'utf8');
    const newContent = await fse.readFile(path.join(options.project.folder, file), 'utf8');
    t.is(newContent, content + addedContent);
});
