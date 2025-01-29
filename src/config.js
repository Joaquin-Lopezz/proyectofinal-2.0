import { fileURLToPath } from 'url';
import { dirname } from 'path';
export const PORT = 8080;
export const MONGODB_CNX_STR =
   'pass';
export const SESSION_SECRET = 'SecretCoder';
export const GITHUB_APP_ID = 901083;
export const GITHUB_CLIENT_ID = 'pass';
export const GITHUB_CLIENT_SECRET ='pass';
export const GITHUB_CALLBACK_URL = 'pass';

//mail sendz
import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'joaquin.ariel.lopez.98@gmail.com',
        pass:'pass',
    },
});

export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'documentacion',
            description: 'API pensada para clase de Swagger',
            version: '1.0.0',
        },
    },
    apis: [`src/docs/*.yaml`],
};


const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
