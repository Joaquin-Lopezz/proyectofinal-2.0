import { model } from 'mongoose';
import { cartsSchema } from './mongoose/carritos.models.mongoose.js';
import { carritoDaoMongoose } from './mongoose/carritos.dao.mongoose.js';
import { logger } from '../../utils/logger.js';

let daoCarts;

const carritoModel = model('carritos', cartsSchema);
daoCarts = new carritoDaoMongoose(carritoModel);
logger.info('perisistiendo carritos en :mongodb');

export function getDaoCarrito() {
    return daoCarts;
}
