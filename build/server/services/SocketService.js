"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatHandler_1 = require("../handlers/chatHandler");
const userHandler_1 = __importDefault(require("../handlers/userHandler"));
const Message_1 = require("../models/Message");
const SocketEvents_1 = require("../utils/SocketEvents");
// const SESSION_RELOAD_INTERVAL = 30 * 1000;
function socketService(io) {
    // Define the event handler for socket connection
    const onConnection = (socket) => {
        const sessionId = socket.request.session.id;
        socket.join(sessionId);
        // const timer = setInterval(() => {
        //   socket.request.session.reload((err) => {
        //     if (err) {
        //       // forces the client to reconnect
        //       socket.conn.close();
        //       // you can also use socket.disconnect(), but in that case the client
        //       // will not try to reconnect
        //     }
        //   });
        // }, SESSION_RELOAD_INTERVAL);
        socket.on(SocketEvents_1.socketEvents.disconnect, () => {
            // clearInterval(timer);
            (0, userHandler_1.default)(io);
        });
        // new user or reconnect user will get active users list
        (0, userHandler_1.default)(io);
        // Handle the "editMessage" event
        socket.on(SocketEvents_1.socketEvents.editMessage, (message, callback) => {
            (0, chatHandler_1.handleEditMessage)(message, socket, callback);
        });
        // Handle the "reactMessage" event
        socket.on(SocketEvents_1.socketEvents.reactMessage, (message, callback) => {
            (0, chatHandler_1.handleReactMessage)(message, socket, callback);
        });
        // Handle the "DeleteMessage" event
        socket.on(SocketEvents_1.socketEvents.deleteMessage, (id, callback) => {
            (0, chatHandler_1.handleDeleteMessage)(id, socket, callback);
        });
        // Handle the "deleteChat" event
        socket.on(SocketEvents_1.socketEvents.deleteChat, (callback) => {
            (0, chatHandler_1.handleDeleteChat)(socket, callback);
        });
        /* Handle the "chatMessage" event
         callback is needed for acknowledgements
         for more info visit the link
         https://socket.io/docs/v4/emitting-events/#acknowledgements
         */
        socket.on(SocketEvents_1.socketEvents.chatMessage, (message, callback) => {
            (0, chatHandler_1.handleChatMessage)(new Message_1.Message(message), callback, socket);
        });
        // Event listener for updating notice message
        socket.on(SocketEvents_1.socketEvents.updateNotice, (callback) => {
            (0, chatHandler_1.handleUpdateNotice)(socket, callback);
        });
    };
    // Attach the connection event handler to the Socket.IO server
    io.on("connection", onConnection);
}
exports.default = socketService;
