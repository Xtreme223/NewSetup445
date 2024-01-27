"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const chatroom_react_express = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level} ${info.filename}: ${info.message} ${info.stack ? info.stack : ""}`));
const logger = winston_1.default.createLogger({
    level: "info",
    format: chatroom_react_express,
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `chatroom_react_express.log`
        //
        new winston_1.default.transports.File({
            filename: "chatroom_react_express-error.log",
            level: "error",
        }),
        new winston_1.default.transports.File({ filename: "chatroom_react_express.log" }),
    ],
});
//
// If we're not in production then log to the `console`
//
if (process.env.NODE_ENV === "development") {
    logger.add(new winston_1.default.transports.Console({
        format: chatroom_react_express,
        level: "debug",
    }));
}
function default_1(filename) {
    return logger.child({ filename: path_1.default.basename(filename) });
}
exports.default = default_1;
