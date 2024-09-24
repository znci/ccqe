import { consola, createConsola } from "consola";
import chalk from 'chalk';

export const logger = createConsola();

export const requestLogger = (req, res, next) => {
    logger.info(`${chalk.green(req.method)} ${chalk.blue(req.url)} - ${chalk.yellow(req.ip)}`);
    next();
    };