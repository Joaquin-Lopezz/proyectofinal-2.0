import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { usuariosService } from '../services/usuarios.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import bcrypt from 'bcrypt';

import {
    GITHUB_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
} from '../config.js';
import { logger } from '../utils/logger.js';
import { crearUsuario } from '../controllers/usuarios.controllers.js';

export const initPassport = () => {
    passport.use(
        'registro',
        new LocalStrategy(
            {
                usernameField: 'email',
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                try {
                    let { nombre } = req.body;
            

                    if (!nombre) {
                        throw CustomError.createError(
                            'Falta el campo nombre',
                            'error',
                            'Campo nombre es requerido',
                            TIPOS_ERROR.REGISTER_FAIL
                        );
                    }
                    const usuerExist = await usuariosService.findOneUserMongo(
                        username
                    );
                    if (usuerExist) {
                        throw CustomError.createError(
                            'Falta el campo nombre',
                            'error',
                            `ya existe un usuario registrado con  ${username} `,
                            TIPOS_ERROR.AUTENTICATION
                        );
                    }
                    let nuevoUsuario = await crearUsuario(password, req.body);

                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.use(
        'loginLocal',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    let usuario;
                    if (
                        email === 'adminCoder@coder.com' &&
                        password === 'adminCod3r123'
                    ) {
                        usuario = {
                            email: 'admin',
                            nombre: 'admin',
                            apellido: 'admin',
                            rol: 'admin',
                        };
                        done(null, usuario);
                    } else {
                        const usuario = await usuariosService.findOneUserMongo(
                            email
                        );
                        if (!usuario) {
                            throw CustomError.createError(
                                'error login',
                                'error',
                                `no existe un usuario registrado con: ${email}`,
                                TIPOS_ERROR.LOGIN_FAIL
                            );
                        }
                        const isPasswordValid = await bcrypt.compare(
                            password,
                            usuario.password
                        );
                        if (!isPasswordValid) {
                            throw CustomError.createError(
                                'error login',
                                'error',
                                `contraseña incorrecta`,
                                TIPOS_ERROR.LOGIN_FAIL
                            );
                        }

                        done(null, usuario);
                    }
                } catch (error) {
                    done(error);
                }
            }
        )
    );
    passport.use(
        'loginGithub',
        new GithubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: GITHUB_CALLBACK_URL,
            },
            async (_, __, profile, done) => {
                let usuario = await usuariosService.findOneUser({
                    email: profile.username,
                });
                if (!usuario) {
                    usuario = await usuariosService.createUsuario({
                        nombre: profile.displayName,
                        email: profile.username,
                    });
                }
                logger.info('usuarioa auntetitacion:', usuario);
                done(null, usuario);
            }
        )
    );

    passport.serializeUser((usuario, done) => {
        try {
            if (usuario.rol === 'admin') {
                done(null, usuario);
            } else {
                done(null, usuario._id);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    });

    passport.deserializeUser(async (id, done) => {
        try {
            if (id.rol === 'admin') {
                const admin = {
                    email: 'adminCoder@coder.com',
                    nombre: 'admin',
                    apellido: 'admin',
                    rol: 'admin',
                };
                done(null, admin);
            } else {
                const usuario = await usuariosService.findById(id);

                done(null, usuario);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    });
};
