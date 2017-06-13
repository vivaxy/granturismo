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

test('should update a new `package.json` file with appropriate format', async(t) => {
    const newJSONAttributes = {
        newAttribute: 'newValue',
        version: '1.0.0',
    };
    const updateJson = createUpdateJson(options);
    const filename = 'package.json';
    const originalJSON = await fse.readJson(path.join(options.scaffold.folder, filename));
    await updateJson(filename, (json) => {
        return {
            ...json,
            ...newJSONAttributes,
        };
    });
    const newJSONText = await fse.readFile(path.join(options.project.folder, filename), 'utf8');
    const newJSON = JSON.parse(newJSONText);
    t.deepEqual({
        ...originalJSON,
        ...newJSONAttributes,
    }, newJSON);
    t.is(newJSONText, JSON.stringify(newJSON, null, 2));
});
