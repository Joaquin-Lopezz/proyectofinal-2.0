import { model } from 'mongoose';
import { productoSchema } from './mongoose/productos.models.mongoose.js';
import { productoDaoMongoose } from './mongoose/productos.dao.mongoose.js';
import { logger } from '../../utils/logger.js';

const productosModel = model('productos', productoSchema);
const daoProducts = new productoDaoMongoose(productosModel);

logger.info('persistiendo productos en: mongodb');

export function getDaoProductos() {
    return daoProducts;
}
