/**
 * @since 20180302 12:42
 * @author vivaxy
 */

import chalk from 'chalk';
import logSymbols from 'log-symbols';

export const native = (message) => {
    console.log(message);
};

export const info = (message) => {
    console.log(chalk.blue(logSymbols.info), message);
};

export const success = (message) => {
    console.log(chalk.green(logSymbols.success), message);
};

export const error = (message) => {
    console.log(chalk.red(logSymbols.error), message);
};
