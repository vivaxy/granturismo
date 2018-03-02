/**
 * @since 20180302 12:34
 * @author vivaxy
 */

import columnify from 'columnify';
import * as configManager from '../../lib/configManager';

export const command = 'list';
export const describe = 'Show all configs';
export const builder = {};
export const handler = () => {
    const userConfig = configManager.read().scaffold;
    const scaffoldList = configManager.readScaffoldListByStatOrder();
    const data = scaffoldList.map((scaffold) => {
        return { stat: userConfig[scaffold].stat, name: scaffold, repo: userConfig[scaffold].repo };
    });
    console.log(columnify(data)); // eslint-disable-line no-console
};
