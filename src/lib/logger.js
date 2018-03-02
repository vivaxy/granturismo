/**
 * @since 20180302 12:42
 * @author vivaxy
 */

import chalk from 'chalk';
import logSymbols from 'log-symbols';

export const native = (message) => {
    console.log(message); // eslint-disable-line no-console
};

export const info = (message) => {
    console.log(chalk.blue(logSymbols.info), message); // eslint-disable-line no-console
};

export const success = (message) => {
    console.log(chalk.green(logSymbols.success), message); // eslint-disable-line no-console
};

export const error = (message) => {
    console.log(chalk.red(logSymbols.error), message); // eslint-disable-line no-console
};
