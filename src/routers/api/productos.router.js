import { Router } from 'express';
import {
    deletecontroller,
    generatemock,
    getcontroller,
    postcontroller,
    putcontroller,
} from '../../controllers/productos.controllers.js';


export const productosRouter = Router();

productosRouter.get('/', getcontroller);

productosRouter.post('/', postcontroller);

productosRouter.delete('/:pid', deletecontroller);

productosRouter.put('/:pid', putcontroller);

//crear funcion para mocking
productosRouter.get('/mockingproducts',generatemock );
