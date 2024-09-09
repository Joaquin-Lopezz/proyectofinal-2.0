import { Router } from 'express';
import { sesionesRouter } from './sesiones.router.js';
import { usuariosRouter } from './usuarios.router.js';
import { productosRouter } from './productos.router.js';

export const webRouter = Router();

webRouter.use(sesionesRouter);
webRouter.use(usuariosRouter);
webRouter.use(productosRouter);
webRouter.get('/', (req, res) => {
    return res.redirect('/login');
});




webRouter.get('/loggerTest', (req, res) => {
    req.logger.debug('debug log ');
    req.logger.http('http log');
    req.logger.info('info log');
    req.logger.warning('warning log');
    req.logger.error('error log');
    req.logger.fatal('fatal log');

    res.send('prueba de logs.');
});




