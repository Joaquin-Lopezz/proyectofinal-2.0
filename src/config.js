import { fileURLToPath } from 'url';
import { dirname } from 'path';
export const PORT = 8080;
export const MONGODB_CNX_STR =
    'mongodb+srv://UserCoder:YzyzdHbr8N94AFkK@cluster0.ixumopf.mongodb.net/proyectoFinal2?retryWrites=true&w=majority&appName=Cluster0';
export const SESSION_SECRET = 'SecretCoder';
export const GITHUB_APP_ID = 901083;
export const GITHUB_CLIENT_ID = 'Iv23liZ3pXxNP39n0V8m';
export const GITHUB_CLIENT_SECRET = '33fd4ceadc992c37e5d956e3d4c63f09163c3545';
export const GITHUB_CALLBACK_URL = 'http://localhost:8080/githubcallback';

//mail send
import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'joaquin.ariel.lopez.98@gmail.com',
        pass: 'nmst xewa jbdt iegw',
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
