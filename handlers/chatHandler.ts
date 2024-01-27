import { Socket } from "socket.io";
import { getChatRepository } from "../config/config";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import { Message } from "../models/Message";
import { socketEvents } from "../utils/SocketEvents";
import { getNewMessageId } from "../services/SettingService";

const log = logger(__filename);

// Define the handler function for the "chatMessage" event
async function handleChatMessage(
  message: Message,
  callback: (arg0: string) => void,
  socket: Socket
): Promise<void> {
  log.info(`Received chat message: ${JSON.stringify(message)}`);

  try {
    if (!message?.text?.trim()) throw ClientError.invalidError();

    // get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const id = await getNewMessageId()
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
    socket.broadcast.emit(socketEvents.chatMessage, message);
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "editMessage" event
async function handleEditMessage(
  updatedMessage: Message,
  socket: Socket,
  callback: (arg0: string) => void
): Promise<void> {
  log.info(`Received edit message: ${JSON.stringify(updatedMessage)}`);

  try {
    if (!updatedMessage?.id?.trim() || !updatedMessage?.text?.trim())
      throw ClientError.invalidError();

    // Get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    // Get the message by id
    const message: Message = messages.filter((msg) => {
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
    socket.broadcast.emit(socketEvents.editedMessage, updatedMessage);
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "editMessage" event
async function handleReactMessage(
  updatedMessage: Message,
  socket: Socket,
  callback: (arg0: string) => void
): Promise<void> {
  log.info(`Received reaction to message: ${JSON.stringify(updatedMessage)}`);

  try {
    if (!updatedMessage?.id?.trim())
      throw ClientError.invalidError();

    // Get the repository
    const repository = getChatRepository();

    // Process the message or perform any necessary actions
    const messages: Message[] = await repository.get();

    // Get the message by id
    const message: Message = messages.filter((msg) => {
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
    socket.broadcast.emit(socketEvents.reactedMessage, updatedMessage);
  } catch (err) {
    log.error(err);
  }
}

// Define the handler function for the "deleteMessage" event
async function handleDeleteChat(
  socket: Socket,
  callback: (arg0: string) => void
): Promise<void> {
  log.info(`Received delete chat request.`);

  try {
    if (!socket.request.session.userInfo.isAdmin)
      throw ClientError.accessDeniedError();

    // Get the repository
    const repository = getChatRepository();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await repository.removeAll();

    // Call the callback function to acknowledge the event
    if (typeof callback === "function") {
      callback("ok");
    }

    // Broadcast the edited message to all connected clients except the sender
    socket.broadcast.emit(socketEvents.chatDeleted);
  } catch (err) {
    log.error(err);
  }
}

async function handleDeleteMessage(
  id: string,
  socket: Socket,
  callback: (response: string) => void
): Promise<void> {
  try {
    if (!id) throw ClientError.invalidError();

    // get the repository
    const repository = getChatRepository();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await repository.remove(id);

    if (result) {
      // Call the callback function to acknowledge the event
      if (typeof callback === "function") {
        log.info(`Deleted message with id: ${id}`);

        // Broadcast the deleted message to all connected clients except the sender
        socket.broadcast.emit(socketEvents.deletedMessage, id);

        callback(JSON.stringify({ success: true }));
      }
    }
  } catch (err) {
    log.error(err);
  }
}

async function handleUpdateNotice(
  socket: Socket,
  callback: (response: string) => void
): Promise<void> {
  try {
    socket.broadcast.emit(socketEvents.updateNotice);
    callback(JSON.stringify({ success: true }));
  } catch (err) {
    log.error(err);
  }
}

export {
  handleChatMessage,
  handleEditMessage,
  handleReactMessage,
  handleDeleteMessage,
  handleDeleteChat,
  handleUpdateNotice,
};
