import { transport } from '../config.js';
import { getDaoUsuarios } from '../dao/usuarios/usuarios.dao.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { hasheadasSonIguales, hashear } from '../utils/criptografia.js';
import { logger } from '../utils/logger.js';

const usuariosDao = getDaoUsuarios();

class UsuariosService {
    async createUsuario(newUser) {
        return await usuariosDao.createUsuario(newUser);
    }
    async updateUsuario(usuario, carrritoId) {
        return await usuariosDao.updateUsuario(usuario, carrritoId);
    }
    async deleteUsers() {
        const dosDiasAtras = new Date();
        dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);
        const usuariosInactivos = await this.findUsersOlds(dosDiasAtras);
        if (usuariosInactivos.length === 0) {
            return;
        }
        const emails = [];
        usuariosInactivos.map((usuarios) => {
            emails.push(usuarios.email);
        });
        emails.map((email) => {
            transport.sendMail({
                from: '<joaquin.ariel.lopez.98@gmail.com>',
                to: email,
                subject: 'usuario eliminado',
                html: `
                        <div>
                            <h1>su usuario a sido desactivado por inactividad</h1>
                          
                        </div>
                      `,
                attachments: [],
            });
        });

        return await usuariosDao.deleteUsers(dosDiasAtras);
    }

    async findUsersOlds(dosDiasAtras) {
        try {
            // Encuentra los documentos que serán eliminados
            const usuariosAntiguos = await usuariosDao.findUsersOlds(
                dosDiasAtras
            );

            return usuariosAntiguos;
        } catch (error) {
            console.error('Error al encontrar documentos:', error);
            throw error;
        }
    }

    async findOneUser(datos) {
        try {
            const usuariogit = await usuariosDao.findOneUser(datos);
            const usuario = usuariogit[0];
            const documents = usuario.documents;
            let profileImageReference = null;

            const profileImageDocument = documents.find(
                (doc) => doc.name === 'profile-image'
            );
            if (profileImageDocument) {
                profileImageReference = profileImageDocument.reference;
            }
            let datosUsuario = null;
            if (usuario) {
                datosUsuario = {
                    id: usuario['_id'],
                    email: usuario['email'],
                    nombre: usuario['nombre'],
                    apellido: usuario['apellido'],
                    rol: usuario['rol'],
                    status: usuario['status_document'],
                    cart: usuario['cart'],
                    profileImage: profileImageReference,
                };
            }

            return datosUsuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }
    
    async findOneUserMongo(datos) {
        try {
            const usuarioMongo = await usuariosDao.findOneUserMongo({
                email: datos,
            });
            return usuarioMongo;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async findOneUserTokenMongo(decodedToken) {
        try {
            const usuario = await usuariosDao.findOneUserMongo({
                resetPasswordToken: decodedToken,
                resetPasswordExpires: { $gt: Date.now() },
            });
    
            return usuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async login(email, password) {
        let datosUsuario;
        try {
            if (
                email === 'adminCoder@coder.com' &&
                password === 'adminCod3r123'
            ) {
                datosUsuario = {
                    email: 'admin',
                    nombre: 'admin',
                    apellido: 'admin',
                    rol: 'admin',
                };
            } else {
                const usuario = await usuariosDao.login(email);
                if (!usuario) {
                    throw CustomError.createError(
                        'UsuarioNoEncontrado',
                        null,
                        'No se encontró un usuario con ese correo electrónico.',
                        TIPOS_ERROR.NOT_FOUND
                    );
                }

                if (!hasheadasSonIguales(password, usuario['password'])) {
                    logger.error(`Error durante la autenticación local`);
                    throw CustomError.createError(
                        'AutenticacionFallida',
                        null,
                        'La contraseña es incorrecta.',
                        TIPOS_ERROR.AUTENTICATION
                    );
                }

                usuario['last_connection'] = new Date();
                await usuario.save();

                datosUsuario = {
                    email: usuario['email'],
                    nombre: usuario['nombre'],
                    apellido: usuario['apellido'],
                    rol: usuario['rol'],
                    carrito: usuario['cart'],
                };
            }
            return datosUsuario;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async findOneAndUpdate(datos) {
        try {
            const usuarioActualizado = await usuariosDao.findOneAndUpdate(
                datos
            );

            return usuarioActualizado;
        } catch (error) {
            logger.error(`${error}`);
            throw error;
        }
    }

    async allUsers() {
        const usuarios = await usuariosDao.allUsers();
        return usuarios.map((usuario) => {
            return {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                last_connection: usuario.last_connection,
            };
        });
    }

    async findByIdAndUpdate(datos, newPassword) {
        return await usuariosDao.findByIdAndUpdate(datos, newPassword);
    }

    async newPassword(data, user) {
        if (data.password1 !== data.password2) {
            return { error: true, code: 'PASSWORDS_DO_NOT_MATCH' };
        }

        const passCript = hashear(data.password1);

        if (hasheadasSonIguales(data.password1, user.password)) {
            return { error: true, code: 'PASSWORDS_ARE_SAME' };
        }

        const userActualizado = await this.findByIdAndUpdate(
            user._id,
            passCript
        );

        return data.password1;
    }
    async findById(id) {
        return await usuariosDao.findById(id);
    }
    async updateRol(userId, rol) {
        if (rol === 'usuario') {
            const usuario = await usuariosDao.userPremium(userId);
            return usuario;
        } else {
            const usuario = await usuariosDao.userUsuario(userId);
            return usuario;
        }
    }
}

export const usuariosService = new UsuariosService();
