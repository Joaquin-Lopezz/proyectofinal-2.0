import { Router } from 'express';
import { soloLogueadosApi } from '../../middlewares/autorizaciones.js';
import {deleteUsers,allUsers,newDatos,documentacion, premium, newPassword, crearUsuario, editUser, getUserLogeado } from '../../controllers/usuarios.controllers.js';

export const usuariosRouter = Router();



usuariosRouter.put('/',newDatos)

usuariosRouter.post('/premium',premium)

usuariosRouter.get('/current', soloLogueadosApi, getUserLogeado)

usuariosRouter.post('/recuperarPassword', editUser);

usuariosRouter.post('/newPassword',newPassword)

usuariosRouter.post('/:email/documents', documentacion)

usuariosRouter.get('/allUsers',allUsers)

usuariosRouter.delete('/delete',deleteUsers)