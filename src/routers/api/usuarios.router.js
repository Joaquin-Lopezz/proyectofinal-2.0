import { Router } from 'express';
import {
    autorizacionAdmin,
    soloLogueadosApi,
} from '../../middlewares/autorizaciones.js';
import {
    deleteUsers,
    allUsers,
    newDatos,
    documentacion,
    premium,
    newPassword,
    crearUsuario,
    editUser,
    getUserLogeado,
} from '../../controllers/usuarios.controllers.js';

export const usuariosRouter = Router();
//agregar solologeadosAPi
usuariosRouter.put('/', newDatos);

usuariosRouter.post('/premium/:uid', premium); // bien

usuariosRouter.get('/current', getUserLogeado); //bien

usuariosRouter.post('/recuperarPassword', editUser); //funciona

usuariosRouter.post('/newPassword', newPassword); //funciona , eliminar el token cuando se acredite

usuariosRouter.post('/documents', documentacion); // funciona verifiar en profundidad al final.

usuariosRouter.get('/allUsers', autorizacionAdmin, allUsers); //bien funciona solo puede entrar el admin

usuariosRouter.delete('/delete', autorizacionAdmin, deleteUsers); //funcinoa
