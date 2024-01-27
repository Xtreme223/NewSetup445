import { Server } from "socket.io";
import logger from "../config/logger";
import { getUsers } from "../services/UserCrudService";
import { socketEvents } from "../utils/SocketEvents";
import { UserDto } from "../dtos/UserDto";
const log = logger(__filename);

// Function to broadcast the active users list of connected users
export default async function broadcastUsersList(io: Server): Promise<void> {
  try {
    const users = await getUsers();
    const activeUsers = Array.from(io.sockets.sockets.values())
      .map(({ id, handshake, request }) => {
        const { time } = handshake;
        const username = request.session.userInfo.username

        return { socketId: id, username, connectedAt: time };
      });

    // Function to add status and additional fields to each user

    const addStatusToUsers = (users: UserDto[], activeUsers: any) => {
      return users.map((user: UserDto) => {
        const activeUser = activeUsers.find((activeUser: any) => activeUser.username === user.username);
        const time = activeUser ? new Date(activeUser.connectedAt).toISOString() : user.lastLoginDate
        
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
    io.emit(socketEvents.usersWithStatus, usersWithStatus);
  } catch (err) {
    log.error(err);
  }
}
