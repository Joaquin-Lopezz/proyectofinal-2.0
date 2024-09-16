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
usuariosRouter.put('/',soloLogueadosApi , newDatos);

usuariosRouter.post('/premium/:uid',soloLogueadosApi, premium); // bien

usuariosRouter.get('/current',soloLogueadosApi  ,getUserLogeado); //bien

usuariosRouter.post('/recuperarPassword',soloLogueadosApi ,editUser); //funciona

usuariosRouter.post('/newPassword',soloLogueadosApi, newPassword); //funciona , eliminar el token cuando se acredite

usuariosRouter.post('/documents',soloLogueadosApi, documentacion); // funciona verifiar en profundidad al final.

usuariosRouter.get('/allUsers', autorizacionAdmin, allUsers); //bien funciona solo puede entrar el admin

usuariosRouter.delete('/delete', autorizacionAdmin, deleteUsers); //funcinoa
