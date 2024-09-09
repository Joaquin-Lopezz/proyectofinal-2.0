import { toPOJO } from '../../utils.js';

export class carritoDaoMongoose {
    constructor(cartsModel) {
        this.cartsModel = cartsModel;
    }

    async create(data) {
        //creamos un carrito
        const carrito = await this.cartsModel.create(data);
        return toPOJO(carrito);
    }

    async findCart(query) {
        // encontramos carrito que pertenesca al usuario
        const carrito = await this.cartsModel.findOne(query).lean();
        return toPOJO(carrito);
    }

    async findByIdCart(id) {
        // encontramos el carrito que corresponda al id
        const carrito = await this.cartsModel.findById(id);
        return carrito;
    }
}
