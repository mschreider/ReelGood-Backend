const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

// Setup winston log file format
const logFileFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.json()
)

// Setup winston log to console format
const consoleFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`
    }),
    winston.format.colorize()
)

// Setup winston file transport
const fileTransport = new DailyRotateFile({
    filename: '%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    prepend: true,
    level: 'debug',
    format: logFileFormat
})

// Setup winston console transport
const consoleTransport = new winston.transports.Console({
    level: 'debug',
    format: consoleFormat
})

// Setup winston logger
const logger = winston.createLogger({
    transports: [
        fileTransport,
        consoleTransport
    ]
})

// Export winston logger
module.exports = { logger }