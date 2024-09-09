import { eliminacionCaracteresNoDesados } from '../middlewares/validacionProducto.js';
import { productoService } from '../services/productos.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { generateProducts } from '../utils/mock.js';
import upload from '../utils/multerConfig.js';
import path from 'path';
export async function getcontroller(req, res, next) {
    try {
        const productos = await productoService.readProduct();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
}

export async function postcontroller(req, res, next) {
    upload.single('productImage')(req, res, async (err) => {
        if (err) {
            console.log('Error en Multer:', err);
            return res.status(400).json({ error: err.message });
        }
        try {
            const newProduct = req.body;

            if (req.file) {
                const filePath = req.file.path; // Ruta completa
                const publicPathIndex = filePath.indexOf('public'); // Encuentra la posición de 'public'

                if (publicPathIndex !== -1) {
                    const relativePath = filePath.slice(publicPathIndex); // Corta la ruta para que comience en 'public'
                    const normalizedPath = relativePath.replace(/\\/g, '/'); // Normaliza la ruta para el uso en URLs

                    newProduct.thumbnail = `/${normalizedPath}`; // Asigna la ruta final al producto, agrega el '/' al inicio
                }
            }

            await eliminacionCaracteresNoDesados(newProduct);

            const producto = await productoService.createProduct(newProduct);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(producto);
        } catch (error) {
            if (error.name === 'MongoServerError') {
                return next(
                    CustomError.createError(
                        'clave Duplicada',
                        error,
                        'clave Duplicada',
                        TIPOS_ERROR.PRODUCTO_EXISTENTE
                    )
                );
            }
            if (error.name === 'ValidationError') {
                return next(
                    CustomError.createError(
                        'faltan completar datos',
                        error,
                        'numeros negativos o faltan completar datos',
                        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                    )
                );
            }
            if (error.name === 'StrictModeError') {
                return next(
                    CustomError.createError(
                        'Datos de producto inválidos',
                        error,
                        'Datos de producto inválidos',
                        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                    )
                );
            } else {
                next(error);
            }
        }
    });
}

export async function deletecontroller(req, res, next) {
    try {
        const id = req.params.pid;
        const { admin } = req.body;
        await productoService.eliminarProductoAdmin(admin, id);

        const productoDelete = await productoService.deleteOne({ _id: id });
        if (productoDelete.deletedCount > 0) {
            return res.json({
                message: `Se eliminó el producto con Id: ${id}`,
            });
        }
        return res
            .status(404)
            .send(`no se encontro ningun producto con Id: ${id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function putcontroller(req, res, next) {
    const idProduct = req.params.pid;
    const nuevosDatos = req.body;
    delete nuevosDatos._id;
    if ('code' in nuevosDatos) {
        return res
            .status(400)
            .send('No se permite modificar los campos id y code.');
    }
    try {
        const productoActualizado = await productoService.updateOne(
            { _id: idProduct },
            nuevosDatos
        );
        if (productoActualizado.matchedCount != 1) {
            return res.status(400).send('id de producto no existe');
        }
        return res.send('el producto se actualizo');
    } catch (error) {}
}

export async function generatemock(req, res, next) {
    const products = generateProducts();
    res.send(products);
}
