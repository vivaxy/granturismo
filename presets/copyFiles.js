/**
 * @since 2016-11-15 20:34
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';

export default (options) => {

    const {
        project,
        scaffold,
    } = options;

    return async(files) => {

        const sourceFolder = scaffold.folder;
        const distFolder = project.folder;

        await Promise.all(files.map((file) => {
            return fsp.copy(path.join(sourceFolder, file), path.join(distFolder, file));
        }));
    };
};
