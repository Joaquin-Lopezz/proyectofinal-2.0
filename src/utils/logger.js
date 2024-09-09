import winston from 'winston';
import stackTrace from 'error-stack-parser';

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

winston.addColors({
    fatal: 'bold red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
});
// Función para agregar detalles de la pila de llamadas al mensaje de log
const formatWithStackTrace = winston.format((info) => {
    if (info.stack) {
        try {
            const stack = stackTrace.parse(new Error(info.stack));
            const stackLines = stack
                .map((call) => `${call.fileName}:${call.lineNumber}`)
                .join('\n');
            info.message = `${info.message}\nStack:\n${stackLines}`;
        } catch (err) {
            info.message = `${info.message}\nStack trace parsing failed: ${err.message}`;
        }
    }
    return info;
});

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        formatWithStackTrace(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [new winston.transports.Console()],
});

const prodLogger = winston.createLogger({
    levels: customLevels,
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './src/errorLogs.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

// Manejar errores globalmente
process.on('uncaughtException', (err) => {
    devLogger.error('Uncaught Exception', err);
    process.exit(1);  // Opcional: Termina el proceso después de registrar el error
});

process.on('unhandledRejection', (reason, promise) => {
    devLogger.error('Unhandled Rejection', new Error(`Unhandled Rejection at: ${promise}, reason: ${reason}`));
    process.exit(1);  // Opcional: Termina el proceso después de registrar el error
});


const env = process.env.NODE_ENV || 'development';
export const logger = env === 'development' ? devLogger : prodLogger;

export const middLogger = (req, res, next) => {
    req.logger = logger;
    next();
};
