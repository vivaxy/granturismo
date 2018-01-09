/**
 * @since 20180109 15:56
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default ({ project: { folder: distFolder }, scaffold: { folder: sourceFolder, git: { headHash } } }) => {
    return async({ scaffoldCommitHash = 'scaffoldCommitHash', scaffoldVersion = 'scaffoldVersion' }) => {
        const distPackageJson = require(path.join(distFolder, 'package.json')); // eslint-disable-line
        const { version } = require(path.join(sourceFolder, 'package.json')); // eslint-disable-line
        await fse.outputFile({ ...distPackageJson, [scaffoldCommitHash]: headHash, [scaffoldVersion]: version });
    };
};
