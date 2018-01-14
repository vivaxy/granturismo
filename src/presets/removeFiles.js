/**
 * @since 2017-02-20 18:54
 * @author vivaxy
 */

import path from 'path';
import fse from 'fs-extra';

export default ({ project: { folder } }) => {
    return async(files) => {
        await Promise.all(files.map((file) => {
            return fse.remove(path.join(folder, file));
        }));
    };
};
