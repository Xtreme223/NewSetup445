"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateNotice = exports.handleDeleteChat = exports.handleDeleteMessage = exports.handleReactMessage = exports.handleEditMessage = exports.handleChatMessage = void 0;
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
const ClientError_1 = require("../models/ClientError");
const SocketEvents_1 = require("../utils/SocketEvents");
const SettingService_1 = require("../services/SettingService");
const log = (0, logger_1.default)(__filename);
// Define the handler function for the "chatMessage" event
async function handleChatMessage(message, callback, socket) {
    log.info(`Received chat message: ${JSON.stringify(message)}`);
    try {
        if (!message?.text?.trim())
            throw ClientError_1.ClientError.invalidError();
        // get the repository
        const repository = (0, config_1.getChatRepository)();
        // Process the message or perform any necessary actions
        const id = await (0, SettingService_1.getNewMessageId)();
        message.id = id.toString();
        message.username = socket?.request?.session?.userInfo?.username;
        message.sender = socket?.id;
        message.time = new Date().toISOString();
        // save
        const result = await repository.add(message);
        log.info(`Successfully added new chat message ${JSON.stringify(result)}`);
        // Call the callback function to acknowledge the event
        if (typeof callback === "function") {
            callback(JSON.stringify(result));
        }
        // Broadcast the chat message to all connected clients except the sender
        socket.broadcast.emit(SocketEvents_1.socketEvents.chatMessage, message);
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleChatMessage = handleChatMessage;
// Define the handler function for the "editMessage" event
async function handleEditMessage(updatedMessage, socket, callback) {
    log.info(`Received edit message: ${JSON.stringify(updatedMessage)}`);
    try {
        if (!updatedMessage?.id?.trim() || !updatedMessage?.text?.trim())
            throw ClientError_1.ClientError.invalidError();
        // Get the repository
        const repository = (0, config_1.getChatRepository)();
        // Process the message or perform any necessary actions
        const messages = await repository.get();
        // Get the message by id
        const message = messages.filter((msg) => {
            return msg.id == updatedMessage.id;
        })[0];
        message.text = updatedMessage.text;
        message.edited_at = new Date().toISOString();
        // Update the message or perform any necessary actions
        updatedMessage = await repository.update(message);
        // Call the callback function to acknowledge the event
        if (typeof callback === "function") {
            callback(JSON.stringify(updatedMessage));
        }
        // Broadcast the edited message to all connected clients except the sender
        socket.broadcast.emit(SocketEvents_1.socketEvents.editedMessage, updatedMessage);
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleEditMessage = handleEditMessage;
// Define the handler function for the "editMessage" event
async function handleReactMessage(updatedMessage, socket, callback) {
    log.info(`Received reaction to message: ${JSON.stringify(updatedMessage)}`);
    try {
        if (!updatedMessage?.id?.trim())
            throw ClientError_1.ClientError.invalidError();
        // Get the repository
        const repository = (0, config_1.getChatRepository)();
        // Process the message or perform any necessary actions
        const messages = await repository.get();
        // Get the message by id
        const message = messages.filter((msg) => {
            return msg.id == updatedMessage.id;
        })[0];
        message.reactions = updatedMessage.reactions;
        // Update the message or perform any necessary actions
        updatedMessage = await repository.update(message);
        // Call the callback function to acknowledge the event
        if (typeof callback === "function") {
            callback(JSON.stringify(updatedMessage));
        }
        // Broadcast the edited message to all connected clients except the sender
        socket.broadcast.emit(SocketEvents_1.socketEvents.reactedMessage, updatedMessage);
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleReactMessage = handleReactMessage;
// Define the handler function for the "deleteMessage" event
async function handleDeleteChat(socket, callback) {
    log.info(`Received delete chat request.`);
    try {
        if (!socket.request.session.userInfo.isAdmin)
            throw ClientError_1.ClientError.accessDeniedError();
        // Get the repository
        const repository = (0, config_1.getChatRepository)();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await repository.removeAll();
        // Call the callback function to acknowledge the event
        if (typeof callback === "function") {
            callback("ok");
        }
        // Broadcast the edited message to all connected clients except the sender
        socket.broadcast.emit(SocketEvents_1.socketEvents.chatDeleted);
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleDeleteChat = handleDeleteChat;
async function handleDeleteMessage(id, socket, callback) {
    try {
        if (!id)
            throw ClientError_1.ClientError.invalidError();
        // get the repository
        const repository = (0, config_1.getChatRepository)();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await repository.remove(id);
        if (result) {
            // Call the callback function to acknowledge the event
            if (typeof callback === "function") {
                log.info(`Deleted message with id: ${id}`);
                // Broadcast the deleted message to all connected clients except the sender
                socket.broadcast.emit(SocketEvents_1.socketEvents.deletedMessage, id);
                callback(JSON.stringify({ success: true }));
            }
        }
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleDeleteMessage = handleDeleteMessage;
async function handleUpdateNotice(socket, callback) {
    try {
        socket.broadcast.emit(SocketEvents_1.socketEvents.updateNotice);
        callback(JSON.stringify({ success: true }));
    }
    catch (err) {
        log.error(err);
    }
}
exports.handleUpdateNotice = handleUpdateNotice;
