import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { carritoDao } from '../../../services/carrito.service.js';

export const usuariosSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, default: '(no aplica)' },
        nombre: { type: String, required: true },
        apellido: { type: String, default: '(sin especificar)' },
        rol: { type: String, default: 'usuario' },
        documents: [{
            name: { type: String, required: true },
            reference: { type: String, required: true }
          }
        ],
        status_document: { type: String, default: null},
        last_connection: { type: Date, default: Date.now },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },  
        cart: {type: String}
    },
    {
        strict: 'throw',
        versionKey: false,
        statics: {},
    }
);



