const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'combined.log', level: 'info', format: winston.format.combine( winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.File({ filename: 'error.log', level: 'error', format: winston.format.combine( winston.format.timestamp(), winston.format.json()) }),
    ]
})
logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;