/**
 * @since 2016-11-15 21:07
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default ({ project }) => {
    return async(filename, data) => {
        const distFolder = project.folder;
        const distFilename = path.join(distFolder, filename);

        await fse.outputFile(distFilename, JSON.stringify(data, null, 2));
    };
};
