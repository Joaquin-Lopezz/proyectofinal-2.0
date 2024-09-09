import { model } from 'mongoose';
import { ticketSchema } from './mongoose/ticket.models.mongoose.js';
import { ticketDaoMongoose } from './mongoose/ticket.dao.mongoose.js';
import { logger } from '../../utils/logger.js';

let daoTicket;

const ticketModel = model('ticket', ticketSchema);
daoTicket = new ticketDaoMongoose(ticketModel);
logger.info('persistiendo ticket en :mongodb');

export function getDaoTicket() {
    return daoTicket;
}
