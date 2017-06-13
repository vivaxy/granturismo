/**
 * @since 2017-06-13 11:41:48
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import createUpdateJson from '../updateJson';
import options from './helpers/options';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should create a new `package.json` file', async(t) => {
    const updateJson = createUpdateJson(options);
    const filename = 'package.json';
    const originalJSON = await fse.readJson(path.join(options.scaffold.folder, filename));
    await updateJson(filename, (json) => {
        return {
            ...json,
        };
    });
    const newJSON = await fse.readJson(path.join(options.project.folder, filename));
    t.deepEqual(originalJSON, newJSON);
});
