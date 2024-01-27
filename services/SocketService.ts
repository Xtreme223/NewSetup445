import { Server, Socket } from "socket.io";
import {
  handleChatMessage,
  handleDeleteChat,
  handleDeleteMessage,
  handleEditMessage,
  handleReactMessage,
  handleUpdateNotice,
} from "../handlers/chatHandler";
import broadcastUsersList from "../handlers/userHandler";
import { Message } from "../models/Message";
import { socketEvents } from "../utils/SocketEvents";
// const SESSION_RELOAD_INTERVAL = 30 * 1000;

function socketService(io: Server): void {
  // Define the event handler for socket connection
  const onConnection = (socket: Socket) => {
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

    socket.on(socketEvents.disconnect, () => {
      // clearInterval(timer);
      broadcastUsersList(io);
    });

    // new user or reconnect user will get active users list
    broadcastUsersList(io);

    // Handle the "editMessage" event
    socket.on(socketEvents.editMessage, (message, callback) => {
      handleEditMessage(message, socket, callback);
    });

    // Handle the "reactMessage" event
    socket.on(socketEvents.reactMessage, (message, callback) => {
      handleReactMessage(message, socket, callback);
    });

    // Handle the "DeleteMessage" event
    socket.on(socketEvents.deleteMessage, (id, callback) => {
      handleDeleteMessage(id, socket, callback);
    });

    // Handle the "deleteChat" event
    socket.on(socketEvents.deleteChat, (callback) => {
      handleDeleteChat(socket, callback);
    });

    /* Handle the "chatMessage" event
     callback is needed for acknowledgements
     for more info visit the link
     https://socket.io/docs/v4/emitting-events/#acknowledgements
     */
    socket.on(socketEvents.chatMessage, (message, callback) => {
      handleChatMessage(new Message(message), callback, socket);
    });

    // Event listener for updating notice message
    socket.on(socketEvents.updateNotice, (callback) => {
      handleUpdateNotice(socket, callback);
    });
  };

  // Attach the connection event handler to the Socket.IO server
  io.on("connection", onConnection);
}

export default socketService;
