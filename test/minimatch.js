/**
 * @since 2016-11-16 15:18
 * @author vivaxy
 */

const minimatch = require('minimatch');

let result = minimatch(`/usr/local/lib/node_modules/granturismo/node_modules/ansi-escapes/index.js`, `**/node_modules/granturismo/node_modules/**`);
console.log(result, true);

result = minimatch(`/usr/local/lib/node_modules/granturismo/lib/main.js`, `**/node_modules/granturismo/**`);
console.log(result, true);

result = minimatch(`/Users/vivaxy/.gt/gt-peon-react-redux/node_modules/babel-helper-explode-assignable-expression/lib/index.js`, `**/node_modules/**`, {
    dot: true,
});
console.log(result, true);
