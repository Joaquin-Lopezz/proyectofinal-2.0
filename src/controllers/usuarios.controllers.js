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

export async function crearUsuario(req, res, next) {
    try {
        req.body.password = hashear(req.body.password);
        const usuario = await usuariosService.createUsuario(req.body);
        console.log(usuario._id)
        const carritoId =await crearCarrito(usuario._id,usuario.email)

        usuario.cart = carritoId;
        await usuariosService.updateUsuario(usuario._id, { cart: carritoId });
        
        req.login(usuario, async (error) => {
            if (error) {
                res.status(401).json({
                    status: 'error',
                    message: error.message,
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    payload: usuario,
                });
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

async function crearCarrito(usuarioId,email) {
    try {
        const carrito = await carritoService.findOne({ usuario: usuarioId ,email:email});
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

        const usuario = await usuariosService.findOneUserMongo({ email: mail });

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
                'An e-mail has been sent to ' +
                    mail +
                    ' with further instructions.'
            );
        });
    } catch (error) {
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
            console.log('Nombre:', nombre);
            console.log('Apellido:', apellido);

            res.json({ message: 'Datos actualizados correctamente' });
        });
    } catch (error) {
        next(error);
    }
}

export async function premium(req, res, next) {
    const { email, rol } = req.body;
    const rolUser = await usuariosService.updateRol(email, rol);
    req.user.rol = rolUser.rol;

    return res.status(200).json({ message: rolUser.rol });
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
            const mail = req.params.email; // Obtiene el ID del usuario de los parámetros de la URL
            const user = await usuariosService.findOneUserMongo({
                email: mail,
            }); // Busca el usuario en la base de datos por ID

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuario no encontrado' }); // Devuelve un error 404 si el usuario no existe
            }

            const documents = [];
            const basePath = 'C:/Users/Tap/Desktop/proyecto final';
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
        res.logger.error(error); // Devuelve un error 500 si ocurre algún problema
    }
}

export async function newPassword(req, res, next) {
    //recibe el token del password buscamos el usuario y le agregamos la nueva contraseña.
    try {
        const data = req.body;
        const decodedToken = data.decodedToken;
        const user = await usuariosService.findOneUserTokenMongo(decodedToken);

        if (!user) res.sendStatus(404);
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
        res.sendStatus(200);
    } catch (error) {}
}
