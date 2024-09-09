import { toPOJO } from '../../utils.js';
import mongoose from 'mongoose';

export class ticketDaoMongoose {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async createTicket(datos) {
        const ticket = await this.ticketModel.create(datos);
        return toPOJO(ticket);
    }
}
