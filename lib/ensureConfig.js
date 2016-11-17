/**
 * @since 2016-11-15 21:31
 * @author vivaxy
 */

import * as configUtil from '../lib/configUtil';
import config from '../config/config.json';

export default () => {
    if (!configUtil.exist()) {
        configUtil.write(config);
    }
};
