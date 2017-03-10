/**
 * @since 2016-11-15 20:44
 * @author vivaxy
 */

import getUpdateFile from './updateFile';

export default (options) => {
    const updateFile = getUpdateFile(options);

    return async(files, filter) => {
        await Promise.all(files.map((file) => {
            return updateFile(file, filter);
        }));
    };
};
