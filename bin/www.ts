#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { app, sessionMiddleware } from "../app";
import debug from "debug";
debug("backend:server");
import { createServer } from "http";
import socketService from "../services/SocketService";
import { Session } from "express-session";
import { Server } from "socket.io";
import { SessionUser } from "../dtos/UserDto";
import logger from "../config/logger";
const log = logger(__filename);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = createServer(app);

/** Now socket io configurations starts. Please refere to the link for more details.
https://socket.io/how-to/use-with-express-session **/

// To add proper typings to the session details,
// you will need to extend the IncomingMessage object from the Node.js "http" module.
declare module "http" {
  interface IncomingMessage {
    session: Session & {
      userInfo: SessionUser;
      authenticated: boolean;
    };
  }
}

const io = new Server(server);

// convert a connect middleware to a Socket.IO middleware
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.authenticated) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

/**
 * Initialize socket service.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
socketService(io);

/**
 * Handling logout
 * https://socket.io/how-to/use-with-express-session
 * @param sessionId
 */
const destroySocketSession = (sessionId: any): void => {
  io.in(sessionId).disconnectSockets();
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

log.info("Server is listening on port  " + port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      log.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      log.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}

export { destroySocketSession };
