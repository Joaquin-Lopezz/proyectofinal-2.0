import { onwerProduct } from '../controllers/productos.controllers.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';

export function soloLogueadosApi(req, res, next) {
    if (req.headers['x-test-mode']) {
        // Omite la verificación de autenticación en el modo de prueba
        return next();
    }
    if (!req.isAuthenticated()) {
        return res
            .status(403)
            .json({ status: 'error', message: 'necesita iniciar sesion' });
    }
    next();
}

export function premium(req, res, next) {
    if (req.headers['x-test-mode']) {
        // Omite la verificación de autenticación en el modo de prueba
        return next();
    }
    const userRole = req.user.rol;
    if (userRole === 'premium' || userRole === 'admin') {
        next();
    } else {
        res.status(403).json({
            message:
                'Acceso denegado. Solo usuarios premium pueden acceder a esta ruta.',
        });
    }
}

export function autorizacionUsuario(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}

export function autorizacionProductos(req, res, next) {
    if (req.user.rol !== 'premium') {
        return res.redirect('/profile');
    }
    if (!req.user) {
        return res.redirect('/login');
    }

    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}
export function statusDocumentacion(req, res, next) {
    if (req.user.status_document == null) {
        next();
    } else {
        return res.redirect('/profile');
    }
}
export function autorizacionAdmin(req, res, next) {
    if (!req.user) {
        res.status(401).send('no estas logeado');
    }
    if (req.user.rol == 'admin') {
        next();
    } else {
        res.status(401).send('acceso denegado, debes ser admin');
    }
}

export async function ownerAdmin(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).send('no estas logeado');
        }
        if (req.user.rol == 'admin') {
            next();
        }
        let respuesta = await onwerProduct(req.user.email, req.params.pid);
        switch (respuesta.message) {
            case 'id de producto no existe':
                return next(
                    CustomError.createError(
                        'ID de producto no existe',
                        'error',
                        'ID de producto no existe',
                        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                    )
                );

            case 'no owner':
                return next(
                    CustomError.createError(
                        'No puedes eliminar este producto, le pertenece a otro usuario',
                        'error',
                        'No puedes eliminar este producto, le pertenece a otro usuario',
                        TIPOS_ERROR.AUTORIZACION
                    )
                );

            case 'ok':
                return next();

            default:
                return next(
                    CustomError.createError(
                        'Acceso denegado, debes ser admin o propietario del producto',
                        'error',
                        'Acceso denegado, debes ser admin o propietario del producto',
                        TIPOS_ERROR.AUTORIZACION
                    )
                );
        }
    } catch (error) {
        return res.status(500).send('Error interno del servidor');
    }
}
