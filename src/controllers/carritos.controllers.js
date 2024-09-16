import mongoose from 'mongoose';
import { carritoService } from '../services/carrito.service.js';
import { productoService } from '../services/productos.service.js';
import { ticketService } from '../services/ticket.service.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { logger } from '../utils/logger.js';
import { usuariosService } from '../services/usuarios.service.js';

export async function getCart(req, res, next) {
    try {
        const cartId = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return next(
                CustomError.createError(
                    `error`,
                    `400`,
                    `Id de carrito invalido`,
                    TIPOS_ERROR.ARGUMENTOS_INVALIDOS
                )
            );
        }

        const cart = await carritoService.findByIdCart(cartId);
        if (!cart) {
            return next(
                CustomError.createError(
                    `error`,
                    `404`,
                    `no se encontro carrito con id ${cartId}`,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ cart });
    } catch (error) {
        next(error);
    }
}

export async function postCartsController(req, res, next) {
    try {
        const userId = req.params.userId;

        let usuario = await usuariosService.findById(userId);

        let carrito = await carritoService.findOne(usuario.cart);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ carrito });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({ error: error.message });
        } else {
            res.status(TIPOS_ERROR.INTENRAL_SERVER_ERROR).json({
                error: 'Error interno del servidor',
            });
        }
        next(error);
    }
}

export async function addProductCart(req, res, next) {
    const carritoId = req.params.cid;
    const idProduct = req.params.pid;

    try {
        if (!mongoose.Types.ObjectId.isValid(carritoId)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }

        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }

        const producto = await productoService.productById(idProduct);

        const carrito = await carritoService.findByIdCart(carritoId);
        if (!carrito) {
            return next(
                CustomError.createError(
                    'No se encontró el carrito',
                    `No se encontró el carrito con el ID: ${carritoId}`,
                    'No se encontró el carrito',
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }
        if (!producto) {
            return next(
                CustomError.createError(
                    'No se encontró el producto',
                    `No se encontró el producto con el ID: ${idProduct}`,
                    'No se encontró el producto',
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        if (carrito.email === producto.owner) {
            return next(
                CustomError.createError(
                    'El producto pertenece al usuario, no puedo agregarlo al carrito',
                    'Operación no permitida',
                    'Conflicto',
                    TIPOS_ERROR.CONFLICT
                )
            );
        }
        await carritoService.addProductCart(carrito, producto);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ carrito });
    } catch (error) {
        console.log(error);
        req.logger.error(error.message);
        next(error);
    }
}

export async function compraCarrito(req, res, next) {
    const carritoId = req.params.cid;
    const carrito = await carritoService.findByIdCart(carritoId);

    try {
        if (carrito.products.length == 0) {
            return res.status(200).json({
                status: 'error',
                payload: {
                    carritoId: carritoId,
                    mensaje: 'no agrego ningun producto al carrito',
                },
            });
        }

        const amount = await carritoService.getQuantityStock(
            carritoId,
            carrito
        );

        if (!amount) {
            return next(CustomError.createError(
                'error',
                '400',
                'No hay suficiente stock para completar la compra',
                TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ))
        }

        const ticket = await ticketService.createTicket({
            amount: amount,
            purchaser: carrito.email,
        });

        res.status(200).json({
            status: 'success',
            payload: {
                ticket: ticket,
                carritoId: carritoId,
                amount: amount,
                mensaje: 'Compra realizada con éxito',
            },
        });
        logger.info(`producto comprado : ${amount}`);
    } catch (error) {
        logger.error(`Error durante la compra del carrito: ${error.message}`);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    const carritoId = req.params.cid;
    const idProduct = req.params.pid;
    try {
        if (!mongoose.Types.ObjectId.isValid(carritoId)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }

        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }
        const carrito = await carritoService.findByIdCart(carritoId);
        if (!carrito) {
            return next(
                CustomError.createError(
                    `el carrito con Id:${carritoId} no existe `,
                    null,
                    `el carrito con Id:${carritoId} no existe `,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }
        const producto = await carritoService.deleteProduct(carrito, idProduct);
        if (!producto) {
            return next(
                CustomError.createError(
                    `el producto con Id:${idProduct} no existe `,
                    null,
                    `el producto con Id:${idProduct} no existe `,
                    TIPOS_ERROR.NOT_FOUND
                )
            );
        }

        res.status(200).json({
            status: 'success',
            payload: {
                mensaje: 'se elimino el producto del carrito ',
                cartId: carritoId,
                productoId: idProduct,
                carrito: carrito,
            },
        });
    } catch (error) {
        next(error);
    }
}
