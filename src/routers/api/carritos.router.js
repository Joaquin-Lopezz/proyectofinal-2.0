import { Router } from 'express';
import {deleteProduct, compraCarrito , addProductCart, postCartsController, getCart } from '../../controllers/carritos.controllers.js';
import { soloLogueadosApi } from '../../middlewares/autorizaciones.js';

export const carritoRouter = Router();
//agregar solo logeados api a todas las
carritoRouter.get('/:cid',soloLogueadosApi,getCart) // funciona

carritoRouter.post('/:userId' ,postCartsController ) //funciona

carritoRouter.post('/:cid/producto/:pid',soloLogueadosApi, addProductCart);  //funciona

carritoRouter.post('/:cid/purchase',soloLogueadosApi, compraCarrito) //funciona

carritoRouter.delete('/:cid/:pid',soloLogueadosApi,deleteProduct)    // funciona