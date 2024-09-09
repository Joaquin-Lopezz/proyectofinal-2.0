import { Schema } from 'mongoose';

export const ticketSchema = new Schema(
    {
    code: {
        type: String,
        unique: true, // Asegura que el código sea único
        required: true,
        default: () => Math.random().toString(36).substring(2, 10), // Genera un código aleatorio
    },
    purchase_datetime: {
        type: Date,
        default: Date.now, // Establece la fecha y hora actual como valor predeterminado
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
   
    
},
 {
        strict: 'throw',
        versionKey: false,
        methods: {},
    });
