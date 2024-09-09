import { Schema, model } from 'mongoose';

export const cartsSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => Math.random().toString(36).substring(2),
        },
        usuario: {
            type: String,
        },
        email: {
            type: String,
        },
        products: [
            {
                idProduct: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: String,
                    required: true,
                },
                thumbnail: {
                    type: String,
                },
                description: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        strict: 'throw',
        versionKey: false,
        _id: false,
    }
);
