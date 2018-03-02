/**
 * @since 20180109 15:56
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default ({ project: { folder: distFolder }, scaffold: { folder: sourceFolder, git: { headHash } } }) => {
    return async({ scaffoldCommitHash = 'scaffoldCommitHash', scaffoldVersion = 'scaffoldVersion' }) => {
        const distPackageJson = require(path.join(distFolder, 'package.json'));
        const { version } = require(path.join(sourceFolder, 'package.json'));
        await fse.outputFile({ ...distPackageJson, [scaffoldCommitHash]: headHash, [scaffoldVersion]: version });
    };
};
