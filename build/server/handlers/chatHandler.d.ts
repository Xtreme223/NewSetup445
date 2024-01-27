import { Socket } from "socket.io";
import { Message } from "../models/Message";
declare function handleChatMessage(message: Message, callback: (arg0: string) => void, socket: Socket): Promise<void>;
declare function handleEditMessage(updatedMessage: Message, socket: Socket, callback: (arg0: string) => void): Promise<void>;
declare function handleReactMessage(updatedMessage: Message, socket: Socket, callback: (arg0: string) => void): Promise<void>;
declare function handleDeleteChat(socket: Socket, callback: (arg0: string) => void): Promise<void>;
declare function handleDeleteMessage(id: string, socket: Socket, callback: (response: string) => void): Promise<void>;
declare function handleUpdateNotice(socket: Socket, callback: (response: string) => void): Promise<void>;
export { handleChatMessage, handleEditMessage, handleReactMessage, handleDeleteMessage, handleDeleteChat, handleUpdateNotice, };
