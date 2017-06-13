/**
 * @since 2017-03-18 11:45:25
 * @author vivaxy
 */

import test from 'ava';
import * as config from '../config';

test('config should has correct exports', (t) => {
    t.true(typeof config.command === 'string');
    t.true(typeof config.describe === 'string');
    t.deepEqual(config.builder, {});
    t.true(typeof config.handler === 'function');
});
