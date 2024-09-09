import { getDaoCarrito } from '../dao/carritos/carritos.dao.js';
import { toPOJO } from '../dao/utils.js';
import { CustomError } from '../utils/CustumErrors.js';
import { TIPOS_ERROR } from '../utils/EError.js';
import { productoService } from './productos.service.js';

export const carritoDao = getDaoCarrito();

class CarritoService {
    async create(criterio) {
        return await carritoDao.createCart(criterio);
    }

    async findOne(usuarioId) {
        try {
            let carrito = await carritoDao.findCart(usuarioId);


            if (!carrito) {
                carrito = await carritoDao.create({
                    email:usuarioId.email,
                    usuario: usuarioId.usuario,
                    products: [],
                });
            }
            return carrito;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error; // Re-lanzar errores personalizados para ser manejados por los controladores o middleware
            } else {
                // Manejar otros errores no previstos
                throw CustomError.createError(
                    'ErrorInterno',
                    error,
                    'Ocurrió un error interno del servidor al buscar o crear el carrito.',
                    TIPOS_ERROR.INTENRAL_SERVER_ERROR
                );
            }
        }
    }

    async findByIdCart(id) {
        const carrito = await carritoDao.findByIdCart(id);

        return carrito;
    }

    async addProductCart(carrito, productoAdd) {
        try {
            
            const productoExistente = carrito.products.find(
                (itemProducto) =>
                    itemProducto.idProduct == productoAdd['_id']
            );
            if (productoExistente) {
                productoExistente.quantity += 1;
            } else {
                const aux = {
                    idProduct: productoAdd['_id'],
                    title: productoAdd['title'],
                    price: productoAdd['price'],
                    description: productoAdd['description'],
                    thumbnail: productoAdd['thumbnail'],
                };
    
                carrito.products.push(aux);
            }
            await carrito.save();
        } catch (error) {
            console.log(error)
        }
       
    }

    async getQuantityStock(idCarrito, productosCarritos) {
        //trae los productos
        const compararStockCompra = await productoService.compareStock(
            idCarrito,
            productosCarritos
        );
        return compararStockCompra;
    }

    async deleteProduct(carrito, idProduct) {
        //del carrito eliminamos el productoid
        const productIndex = carrito.products.findIndex(
            (product) => product.idProduct === idProduct
        );
        if (productIndex == -1) {
            return undefined;
        }
        carrito.products.splice(productIndex, 1);
        await carrito.save();
        return toPOJO(carrito);
    }

    async buscarIndiceDelProducto(Idcarrito, productoId) {
        const carrito = await this.findByIdCart(Idcarrito);

        const productoIndex = carrito.products.findIndex(
            (item) => item.idProduct === productoId
        );

        if (productoIndex === -1) {
            return 'producto no encontrado';
        }
        carrito.products.splice(productoIndex, 1);
        await carrito.save();
    }
}

export const carritoService = new CarritoService();
