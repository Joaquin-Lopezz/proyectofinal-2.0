import { model } from 'mongoose';
import { usuariosSchema } from './mongoose/usuarios.models.mongoose.js';
import { usuariosDaoMongoose } from './mongoose/usuarios.dao.mongoose.js';
import {logger} from '../../utils/logger.js';

let daoUsuarios;

const usuariosModel = model('usuarios', usuariosSchema);
daoUsuarios = new usuariosDaoMongoose(usuariosModel);
logger.info('persistiendo usuarios en : mongodb');

export function getDaoUsuarios() {
    return daoUsuarios;
}
