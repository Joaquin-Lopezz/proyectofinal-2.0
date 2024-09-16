import { Router } from 'express';
import {
    deletecontroller,
    generatemock,
    getcontroller,
    postcontroller,
    putcontroller,
} from '../../controllers/productos.controllers.js';
import {ownerAdmin, autorizacionAdmin, premium,soloLogueadosApi } from '../../middlewares/autorizaciones.js';

export const productosRouter = Router();

productosRouter.get('/', soloLogueadosApi,getcontroller); 

productosRouter.post('/',soloLogueadosApi,premium,postcontroller);  

productosRouter.delete('/:pid',soloLogueadosApi,ownerAdmin, deletecontroller);  

productosRouter.put('/:pid',soloLogueadosApi, autorizacionAdmin, putcontroller); 
//crear funcion para mocking
productosRouter.get('/mockingproducts',generatemock );
