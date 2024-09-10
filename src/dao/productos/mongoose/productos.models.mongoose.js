import { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export const productoSchema = new Schema(
    {

        title: { type: String, required: true },
        description: { type: String, required: true },
        price: {
            type: Number,
            required: true,
            min: [0, 'precio debe ser un numero positivo'],
        },
        thumbnail: { type: String },
        code: { type: String, required: true, unique: true },
        stock: {
            type: Number,
            required: true,
            min: [0, 'sctok  debe ser un numero positivo'],
        },
        category: { type: String, required: true },
        owner: { type: String, required: true, default: 'admin' },
        status: { type: String, required: true },
    },
    {
        strict: 'throw',
        versionKey: false,
        methods: {},
    }
);

productoSchema.plugin(paginate);
