import { Schema, model } from 'mongoose';

export const cartsSchema = new Schema(
    {
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
                _id: false
            },
        ],
    },
    {
        strict: 'throw',
        versionKey: false
    }
);
