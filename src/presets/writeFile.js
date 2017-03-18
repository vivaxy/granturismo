/**
 * @since 2016-11-15 20:41
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';

export default (options) => {
    const {
        project,
    } = options;

    return async(filename, data) => {
        const distFolder = project.folder;
        const distFilename = path.join(distFolder, filename);

        await fsp.outputFile(distFilename, data);
    };
};
