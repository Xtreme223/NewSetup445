import winston from "winston";
import path from "path";

const chatroom_react_express = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level} ${info.filename}: ${info.message} ${
        info.stack ? info.stack : ""
      }`
  )
);

const logger = winston.createLogger({
  level: "info",
  format: chatroom_react_express,
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `chatroom_react_express.log`
    //
    new winston.transports.File({
      filename: "chatroom_react_express-error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "chatroom_react_express.log" }),
  ],
});

//
// If we're not in production then log to the `console`
//

if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: chatroom_react_express,
      level: "debug",
    })
  );
}

export default function (filename: string) {
  return logger.child({ filename: path.basename(filename) });
}
