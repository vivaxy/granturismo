/**
 * @since 2016-11-15 20:41
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default (options) => {

    const {
        project,
        scaffold,
    } = options;

    return (filename, data) => {

        const distFolder = project.folder;
        const distFilename = path.join(distFolder, filename);

        // console.log(`writing ${filename}...`);
        fse.outputFileSync(distFilename, data);
    };
};
