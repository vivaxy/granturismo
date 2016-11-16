/**
 * @since 2016-11-15 20:34
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default (options) => {

    const {
        project,
        scaffold,
    } = options;

    return (files) => {

        const sourceFolder = scaffold.folder;
        const distFolder = project.folder;

        // console.log(`distFolder: ${distFolder}`);
        // console.log(`sourceFolder: ${sourceFolder}`);

        // console.log(`copying ${sourceFolder} into ${distFolder}...`);
        // copy all files
        files.forEach((file) => {
            // console.log(`copying ${file}...`);
            fse.copySync(path.join(sourceFolder, file), path.join(distFolder, file));
        });
    };
};
