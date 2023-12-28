import 'express-async-errors';
import http from 'http';

import {Logger} from 'winston';
import {IMessageDetails, winstonLogger} from "@fulbertgato/jobber-shared";
import {config} from "./config";
import {Application} from "express";
import {healthRoutes} from "./route";
import {checkConnection} from "./elasticsearch";
import {createConnection} from "./queues/connection";
import {Channel} from "amqplib";
import {consumeAuthEmailMessages, consumeOrderEmailMessages} from "./queues/email.consumer";

const SERVER_PORT = process.env.SERVER_PORT || 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {

    startServer(app);
    app.use('', healthRoutes());
    startQueues();
    startElascticSearch();

}

async function startQueues(): Promise<void> {
    const emailChannel: Channel = await createConnection() as Channel;
    const orderChannel: Channel = await createConnection() as Channel;
    await consumeAuthEmailMessages(emailChannel);
    await consumeOrderEmailMessages(orderChannel);
}

function startElascticSearch(): void {
    checkConnection();
}

async function startServer(app: Application): Promise<void> {
    try {
        const server = http.createServer(app);
        server.listen(SERVER_PORT, () => {
            log.info(`NotificationService listening on port ${SERVER_PORT}`);
            log.info(`Worker ${process.pid} started on port ${SERVER_PORT} in ${config.NODE_ENV} mode`);
        });

    } catch (error) {
        log.log('error', 'NotificationService startServer() method', error);
    }

}