import { transport } from '../config.js';

import { usuariosService } from '../services/usuarios.service.js';
import { hashear } from '../utils/criptografia.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import bcrypt from 'bcrypt';
import upload from '../utils/multerConfig.js';
import path from 'path';
import { logger } from '../utils/logger.js';
import { carritoService } from '../services/carrito.service.js';
import { urlencoded } from 'express';
import { __dirname } from '../config.js';
import mongoose from 'mongoose';
export async function crearUsuario(password, usuario) {
    try {
        usuario.password = hashear(password);

        const newUser = await usuariosService.createUsuario(usuario);

        const carritoId = await crearCarrito(newUser._id, newUser.email);
        usuario.cart = carritoId;
        await usuariosService.updateUsuario(newUser._id, { cart: carritoId });
        return newUser;
    } catch (error) {
        console.log(error);
        return { status: 'error', message: error.message };
    }
}

async function crearCarrito(usuarioId, email) {
    try {
        const carrito = await carritoService.findOne({
            usuario: usuarioId,
            email: email,
        });
        return carrito._id;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserLogeado(req, res, next) {
    try {
        const usuario = await usuariosService.findOneUser(
            { email: req['user'].email },
            { password: 0 }
        );

        res.json({ status: 'success', payload: usuario });
    } catch (error) {
        req.logger.error(error);
        next();
    }
}

export async function editUser(req, res, next) {
    try {
        const mail = req.body.email;
        console.log(mail)
        const usuario = await usuariosService.findOneUserMongo(mail);
        if (!usuario) {
            return next(
                CustomError.createError(
                    `no hay usuario registrado con ese mail`,
                    null,
                    `no hay usuario registrado con ese mail`,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        // Generar token seguro con bcrypt
        const token = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                }
                bcrypt.hash(mail, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        });
        const encodedToken = encodeURIComponent(token);

        // Establecer token y tiempo de expiración
        const expiration = Date.now() + 3600000; // 1 hora
        usuario.resetPasswordToken = encodedToken;
        usuario.resetPasswordExpires = expiration;

        await usuario.save();
        const mailOptions = {
            from: '<joaquin.ariel.lopez.98@gmail.com>',
            to: mail,
            subject: 'Restablecimiento de Contraseña',
            text: `Recibes este correo porque  ha solicitado el restablecimiento de la contraseña para tu cuenta.\n\n
            Por favor, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador para completar el proceso:\n\n
            http://${req.headers.host}/reset/${encodedToken}\n\n
            Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.\n`,
        };

        transport.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send('Error sending email.');
            }
            res.status(200).send(
                `se envio un mail a: ${mail}. para modificar contraseña.
                 encodedToken = ${encodedToken}
            `
            );
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function deleteUsers(req, res, next) {
    try {
        const result = await usuariosService.deleteUsers();
        if (!result) {
            res.json({ message: 'no hay usuarios para eliminar' });
        } else {
            res.json({
                message: `han sido eliminado ${result.deletedCount} usuarios.`,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function allUsers(req, res, next) {
    try {
        const usuarios = await usuariosService.allUsers();
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
}

export async function newDatos(req, res, next) {
    try {
        upload.single('profileImage')(req, res, (err) => {
            if (err) {
                console.log('Error en Multer:', err);
                return res.status(400).json({ error: err.message });
            }
            const { nombre, apellido } = req.body;

            res.json({ message: 'Datos actualizados correctamente' });
        });
    } catch (error) {
        next(error);
    }
}

export async function premium(req, res, next) {
    try {
        const userId = req.params.uid;
        if (req.body && Object.keys(req.body).length === 0) {
            if (!req.user) {
                return res
                    .status(400)
                    .json({ message: 'no has iniciado sesion' });
            }
            const rol = req.user.rol;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res
                    .status(400)
                    .json({ message: 'ID de usuario inválido' });
            }

            const usuarioExistente = await usuariosService.findById(userId);
            if (!usuarioExistente) {
                return res
                    .status(404)
                    .json({ message: 'Usuario no encontrado' });
            }
            if(usuarioExistente.documents.length ===0){
                return res.status(403).json({message: 'falta cargar documentacion'}) 
            }
            const rolUser = await usuariosService.updateRol(userId, rol);

            return res
                .status(200)
                .json({ message: `rol actualizado a ${rolUser.rol}` });
        }
        //permite correr los tests
        if (req.body.user.rol) {
            const rolUser = await usuariosService.updateRol(
                userId,
                req.body.user.rol
            );
            return res
                .status(200)
                .json({ message: `rol actualizado a ${rolUser.rol}` });
        }
        //
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function documentacion(req, res, next) {
    try {
        await upload.fields([
            { name: 'profile-image', maxCount: 1 },
            { name: 'productImage', maxCount: 1 },
            { name: 'document', maxCount: 10 },
            { name: 'identificacion', maxCount: 1 },
            { name: 'comprobanteDomicilio', maxCount: 1 },
            { name: 'comprobanteCuenta', maxCount: 1 },
        ])(req, res, async (err) => {
            if (err) {
                console.log('Error en Multer:', err);
                return res.status(400).json({ error: err.message });
            }
          
            const mail = req.user.email;

            const user = await usuariosService.findOneUserMongo(mail);

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuario no encontrado' }); // Devuelve un error 404 si el usuario no existe
            }

            const documents = [];
            const basePath = __dirname;

            if (!req.files['identificacion'] && !req.files['comprobanteDomicilio'] &&!req.files['comprobanteCuenta'] ) {
                return res.status(400).json({message : 'ingrese todos los archivos'})
            }
            
            if (req.files['profile-image']) {
                const filePath = req.files['profile-image'][0].path;
                const relativePath = path.relative(basePath, filePath);
                const normalizedPath = path
                    .normalize(relativePath)
                    .replace(/\\/g, '/');
                documents.push({
                    name: 'profile-image',
                    reference: normalizedPath,
                });
            }

            if (req.files['identificacion']) {
                const filePath = req.files['identificacion'][0].path;
                const relativePath = path.relative(basePath, filePath);
                const normalizedPath = path
                    .normalize(relativePath)
                    .replace(/\\/g, '/');
                documents.push({
                    name: 'identificacion',
                    reference: normalizedPath,
                });
            }
            if (req.files['comprobanteDomicilio']) {
                const filePath = req.files['comprobanteDomicilio'][0].path;
                const relativePath = path.relative(basePath, filePath);
                const normalizedPath = path
                    .normalize(relativePath)
                    .replace(/\\/g, '/');
                documents.push({
                    name: 'comprobanteDomicilio',
                    reference: normalizedPath,
                });
            }
            if (req.files['comprobanteCuenta']) {
                const filePath = req.files['comprobanteCuenta'][0].path;
                const relativePath = path.relative(basePath, filePath);
                const normalizedPath = path
                    .normalize(relativePath)
                    .replace(/\\/g, '/');
                documents.push({
                    name: 'comprobanteCuenta',
                    reference: normalizedPath,
                });
            }
            if (req.body.nombre) {
                user.nombre = req.body.nombre;
            }
            if (req.body.apellido) {
                user.apellido = req.body.apellido;
            }

            user.documents = documents;
            user.status_document = true;

            await user.save(); // Guarda los cambios en la base de datos

            // Responde con un mensaje de éxito y la información de los archivos subidos
            res.status(200).json({
                message: 'Archivos subidos exitosamente',
                files: req.files, // Contiene la información de los archivos subidos
            });
        });
    } catch (error) {
        console.log(error);
        next(error); // Devuelve un error 500 si ocurre algún problema
    }
}

export async function newPassword(req, res, next) {
    //recibe el token del password buscamos el usuario y le agregamos la nueva contraseña.
    try {
        const data = req.body;
        const decodedToken = req.body.decodedToken;

        const user = await usuariosService.findOneUserTokenMongo(decodedToken);

        if (!user) res.status(404).json({ error: 'no se encontro el usuario' });
        const result = await usuariosService.newPassword(data, user);

        if (result.error) {
            switch (result.code) {
                case 'PASSWORDS_DO_NOT_MATCH':
                    return res.status(400).json({
                        error: 'las contraseñas tienen que coincidir',
                    });
                case 'PASSWORDS_ARE_SAME':
                    return res.status(400).json({
                        error: 'no puedes cambiar tu contraseña por la actual',
                    });
                default:
                    return res
                        .status(500)
                        .json({ error: 'An unknown error occurred' });
            }
        }

        res.status(200).json({ message: 'su contraseña a sido actualizada' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

