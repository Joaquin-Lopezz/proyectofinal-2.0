import { Router } from 'express';
import { sesionesRouter } from './sesiones.router.js';
import { usuariosRouter } from './usuarios.router.js';
import { productosRouter } from './productos.router.js';
import { carritoRouter } from './carritos.router.js';
import { tickeRouter } from './ticket.router.js';

export const apiRouter = Router();

apiRouter.use('/sessions', sesionesRouter);
apiRouter.use('/usuarios', usuariosRouter);

apiRouter.use('/products', productosRouter);
apiRouter.use('/carts', carritoRouter);

apiRouter.use('/ticket',tickeRouter)
