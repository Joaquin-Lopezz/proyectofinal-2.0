import { Router } from 'express';
import { soloLogueadosApi } from '../../middlewares/autorizaciones.js';
import passport from 'passport';
import { crearUsuario } from '../../controllers/usuarios.controllers.js';

export const sesionesRouter = Router();

//REGISTER

sesionesRouter.post('/register', crearUsuario);

//LOGIN
sesionesRouter.post(
    '/login',
    passport.authenticate('loginLocal', { failWithError: true }),

    async (req, res, next) => {
        res.status(201).json({
            status: 'success',
            message: 'login success',
            user: req.user,
        });
    },
    (error, req, res, next) => {
        res.status(401).json({ status: 'error', message: error.message });
    }
);

sesionesRouter.get('/current', soloLogueadosApi, (req, res) => {
    res.json(req.user);
});

sesionesRouter.delete('/current', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ status: 'logout error', body: err });
            }
            res.json({ status: 'success', message: 'logout OK' });
        });
    } catch (error) {
        next(error);
    }
});
