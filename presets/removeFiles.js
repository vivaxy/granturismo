/**
 * @since 2017-02-20 18:54
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';

export default (options) => {

    const {
        project,
    } = options;

    return async(files) => {

        const folder = project.folder;

        await Promise.all(files.map((file) => {
            return fsp.remove(path.join(folder, file));
        }));
    };
};
