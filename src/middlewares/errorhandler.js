import { TIPOS_ERROR } from '../utils/EError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    // grabarlo a fs...
    logger.error(`${error.message}`);

    switch (error.code) {
        case TIPOS_ERROR.AUTENTICATION || TIPOS_ERROR.AUTORIZACION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales incorrectas` });

        case TIPOS_ERROR.ARGUMENTOS_INVALIDOS || TIPOS_ERROR.PRODUCTO_EXISTENTE:
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `${error.message}` });

        case TIPOS_ERROR.NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `${error.message}` });
        default:
            res.setHeader('Content-Type', 'application/json');
            return res
                .status(500)
                .json({ error: `Error - contacte al administrador` });
    }

    // return next()
};
