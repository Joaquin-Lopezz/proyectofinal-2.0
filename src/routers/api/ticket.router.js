import { Router } from 'express';
import { postController } from '../../controllers/ticket.controllers.js';
import { soloLogueadosApi } from '../../middlewares/autorizaciones.js';

export const tickeRouter = Router();

tickeRouter.post('/', soloLogueadosApi, postController);
