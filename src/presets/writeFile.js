/**
 * @since 2016-11-15 20:41
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default ({ project }) => {
    return async(filename, data) => {
        const distFolder = project.folder;
        const distFilename = path.join(distFolder, filename);

        await fse.outputFile(distFilename, data);
    };
};
