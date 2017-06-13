/**
 * @since 2017-03-18 12:02:48
 * @author vivaxy
 */

import test from 'ava';
import * as init from '../init';

test('init should has correct exports', (t) => {
    t.true(typeof init.command === 'string');
    t.true(typeof init.describe === 'string');
    t.deepEqual(init.builder, {});
    t.true(typeof init.handler === 'function');
});
