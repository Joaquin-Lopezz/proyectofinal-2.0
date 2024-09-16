import { Router } from 'express';
import { vistaProducto } from '../../controllers/router/productos.controllers.js';
import {  autorizacionProductos, soloLogueadosApi } from '../../middlewares/autorizaciones.js';

export const productosRouter = Router();

productosRouter.get('/productos',autorizacionProductos  , vistaProducto);


