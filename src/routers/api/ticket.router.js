import { Router } from 'express';

import { postController } from '../../controllers/ticket.controllers.js';

export const tickeRouter = Router();

tickeRouter.post('/', postController )


