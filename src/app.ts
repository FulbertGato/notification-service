import express, { Express } from 'express';
import {winstonLogger} from "@fulbertgato/jobber-shared";
import {config} from "./config";
import {start} from "./server";
import {Logger} from "winston";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

function initialize(): void {
    const app: Express = express();
    start(app);
    log.info('Notification Service Initialized');
}
initialize();