import pino from 'pino';

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});

class LoggerService {
    static info(message) {
        logger.info(message);
    }

    static warn(message) {
        logger.warn(message);
    }

    static error(message) {
        logger.error(message);
    }

    static debug(message) {
        logger.debug(message);
    }
}

export default LoggerService;
