import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { usuariosService } from '../services/usuarios.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
TIPOS_ERROR;
import {
    GITHUB_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
} from '../config.js';
import { logger } from '../utils/logger.js';

passport.use(
    'loginLocal',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async function verificationCallback(username, password, done) {
            try {
                const datosUsuario = await usuariosService.login(
                    username,
                    password
                );
              
                done(null, datosUsuario);
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

passport.serializeUser((user, next) => {
    next(null, user);
});
passport.deserializeUser((user, next) => {
    next(null, user);
});

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
