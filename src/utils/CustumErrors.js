import { TIPOS_ERROR } from "./EError.js";

export class CustomError {
    static createError(name = "Error", cause, message, code = TIPOS_ERROR.INTERNAL_SERVER_ERROR) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;

        return error; // Devolver el error en lugar de lanzarlo
    }
}


