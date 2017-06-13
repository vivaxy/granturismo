/**
 * @since 2016-11-15 20:44
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

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
        const sourceData = await fse.readJson(sourceFilename);
        const distData = filter(sourceData);
        await fse.outputFile(distFilename, JSON.stringify(distData, null, 2));
    };
};
