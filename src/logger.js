import winston from "winston";

const migrationLogger =
    winston.createLogger({
        level: "info",
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ dirname: "log", filename: "migration-success.log" }),
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(winston.format.colorize({ all: true }))
            })
        ]
    });

const migrationErrorLogger =
    winston.createLogger({
        level: "error",
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ dirname: "log", filename: "migration-errors.log" }),
            new winston.transports.Console({
                level: "error",
                format: winston.format.combine(winston.format.colorize({ all: true }))
            })
        ]
    });

export {
    migrationLogger,
    migrationErrorLogger
};