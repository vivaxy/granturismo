/**
 * @since 2017-06-13 13:30:35
 * @author vivaxy
 */

import path from 'path';
import test from 'ava';
import fse from 'fs-extra';

import createWriteJson from '../writeJson';
import options from './helpers/options';

test.afterEach.always('clear project folder', async() => {
    await fse.remove(options.project.folder);
});

test('should write a new `package.json` file with appropriate format', async(t) => {
    const json = {
        newAttribute: 'newValue',
        version: '1.0.0',
    };
    const writeJson = createWriteJson(options);
    const filename = 'package-for-write-json.json';
    await writeJson(filename, json);
    const newJSONText = await fse.readFile(path.join(options.project.folder, filename), 'utf8');
    t.is(newJSONText, JSON.stringify(json, null, 2));
});
