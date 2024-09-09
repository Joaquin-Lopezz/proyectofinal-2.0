import { Router } from 'express';
import {deleteProduct, compraCarrito , addProductCart, postCartsController, getCart } from '../../controllers/carritos.controllers.js';

export const carritoRouter = Router();



carritoRouter.get('/:cid',getCart)

carritoRouter.post('/:userId',  postCartsController )

carritoRouter.post('/:cid/producto/:pid', addProductCart);


carritoRouter.post('/:cid/purchase', compraCarrito)


carritoRouter.delete('/:cid/:pid',deleteProduct)