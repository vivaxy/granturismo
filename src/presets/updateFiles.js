/**
 * @since 2016-11-15 20:44
 * @author vivaxy
 */

import getUpdateFile from './updateFile';

export default ({ project, scaffold }) => {
    const updateFile = getUpdateFile({ project, scaffold });

    return async(files, filter) => {
        await Promise.all(files.map((file) => {
            return updateFile(file, filter);
        }));
    };
};
