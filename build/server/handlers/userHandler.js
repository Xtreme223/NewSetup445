"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const UserCrudService_1 = require("../services/UserCrudService");
const SocketEvents_1 = require("../utils/SocketEvents");
const log = (0, logger_1.default)(__filename);
// Function to broadcast the active users list of connected users
async function broadcastUsersList(io) {
    try {
        const users = await (0, UserCrudService_1.getUsers)();
        const activeUsers = Array.from(io.sockets.sockets.values())
            .map(({ id, handshake, request }) => {
            const { time } = handshake;
            const username = request.session.userInfo.username;
            return { socketId: id, username, connectedAt: time };
        });
        // Function to add status and additional fields to each user
        const addStatusToUsers = (users, activeUsers) => {
            return users.map((user) => {
                const activeUser = activeUsers.find((activeUser) => activeUser.username === user.username);
                const time = activeUser ? new Date(activeUser.connectedAt).toISOString() : user.lastLoginDate;
                return {
                    username: user.username,
                    status: activeUser ? "online" : "offline",
                    time,
                    socketId: activeUser ? activeUser.socketId : "",
                };
            });
        };
        // Add status and additional fields to each user
        const usersWithStatus = addStatusToUsers(users, activeUsers);
        log.info("Broadcasting usersWithStatus");
        log.info(`Users list with status: ${usersWithStatus}`);
        // // filter unique usernames
        // const uniqueUsernames = [...new Set(usersWithStatus)];
        // Broadcast usersWithStatus
        io.emit(SocketEvents_1.socketEvents.usersWithStatus, usersWithStatus);
    }
    catch (err) {
        log.error(err);
    }
}
exports.default = broadcastUsersList;
