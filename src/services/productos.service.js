import { transport } from '../config.js';
import { getDaoProductos } from '../dao/productos/productos.dao.js';
import { carritoService } from './carrito.service.js';

const productosDao = getDaoProductos();

class ProductoService {
    async readProduct() {
        return await productosDao.findproducts();
    }

    async productById(id) {
        return await productosDao.getProductById(id);
    }

    async createProduct(newProduct) {
        return await productosDao.createProduct(newProduct);
    }

    async deleteOne(id) {
        return await productosDao.deleteOne(id);
    }

    async emailProductoEliminado(producto) {
        try {
            await transport.sendMail({
                from: '<joaquin.ariel.lopez.98@gmail.com>',
                to: producto.owner,
                subject: 'se ha eliminado su producto',
                html: `
                                <div>
                                    <h1> _id: $${producto._id}</h1>
                                    <h1>title:${producto.title}</h1>
                                    <h1>description:${producto.description}</h1>
                                    <h1>stock:${producto.stock}</h1>
                                    <h1>price:${producto.price}</h1>
                                </div>
                                    `,
                attachments: [],
            });
            return;
        } catch (error) {
            console.log(error);
        }
    }
    async eliminarProductoAdmin(admin, id) {
        if (admin) {
            const producto = await this.productById(id);
            if (producto.owner !== 'admin') {
                productoService.emailProductoEliminado(producto);
            }
        }
    }
    async updateOne(id, datos) {
    
            return await productosDao.updateOne(id, datos);

        
    }
    
    async compareStock(idCarrito, productosCarritos) {
        let amount = 0;
        for (const product of productosCarritos.products) {
            const quantityBuyProduct = product.quantity;
            const id = product.idProduct;
            const productoStock = await productosDao.getProductById(id);

            if (productoStock.stock >= quantityBuyProduct) {
                //compramos que esten los productos en el stock y los restamos de productos
                const restaStock = productoStock.stock - quantityBuyProduct;
                const idProduct = { _id: id };
                const nuevoStock = { stock: restaStock };
                await productosDao.updateOne(idProduct, nuevoStock);

                amount += product.price * quantityBuyProduct;
                //eliminar producto del carrito
                await carritoService.buscarIndiceDelProducto(idCarrito, id);
            }
        }

        return amount;
    }
}

export const productoService = new ProductoService();
