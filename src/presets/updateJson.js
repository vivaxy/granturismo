/**
 * @since 2016-11-15 20:44
 * @author vivaxy
 */

import path from 'path';
import fsp from 'fs-promise';

export default (options) => {
    const {
        project,
        scaffold,
    } = options;

    return async(filename, filter) => {
        const sourceFolder = scaffold.folder;
        const distFolder = project.folder;

        const sourceFilename = path.join(sourceFolder, filename);
        const distFilename = path.join(distFolder, filename);
        const sourceData = await fsp.readJson(sourceFilename);
        const distData = filter(sourceData);
        await fsp.outputJson(distFilename, distData);
    };
};
