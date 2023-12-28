import {winstonLogger} from "@fulbertgato/jobber-shared";
import {Logger} from "winston";
import {config} from "../config";
import {IEmailLocals} from "@fulbertgato/jobber-shared/src/email.interface";
import {emailTemplates} from "../helpers";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
    try {
        emailTemplates(template, receiverEmail, locals);
        log.info('Email sent successfully.');
    } catch (error) {
        log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
    }
}

export { sendEmail };