"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllChat = exports.downloadAll = exports.downloadJson = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ClientError_1 = require("../models/ClientError");
const stream_1 = require("stream");
const config_1 = require("../config/config");
const log = (0, logger_1.default)(__filename);
// Download JSON file with filtered messages
const downloadJson = async (res) => {
    log.debug("download all called");
    const DATA_FOLDER = "data"; // Folder to store the JSON files
    const filePath = path_1.default.join(DATA_FOLDER, `Message.json`);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        // Read the file content
        const fileContent = fs_1.default.readFileSync(filePath, "utf8");
        // Parse the JSON content
        const messages = JSON.parse(fileContent);
        // Filter the messages to include only the username and text
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const filteredMessages = messages.map(({ username, text, time, replyTo }) => ({
            username,
            text,
            time,
            replyTo,
        }));
        // Convert the filtered messages to JSON string
        const filteredJson = JSON.stringify(filteredMessages, null, 2);
        // Set the appropriate headers for the download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=Message.json");
        // Create a readable stream from the filtered JSON content
        const filteredStream = new stream_1.Readable();
        filteredStream.push(filteredJson);
        filteredStream.push(null);
        // Pipe the filtered stream to the response
        filteredStream.pipe(res);
    }
    else {
        throw ClientError_1.ClientError.notExistsError();
    }
};
exports.downloadJson = downloadJson;
// Download JSON file with filtered messages
const downloadAll = async () => {
    log.debug("download all called");
    const DATA_FOLDER = "data"; // Folder to store the JSON files
    const filePath = path_1.default.join(DATA_FOLDER, `Message.json`);
    // Check if the file exists
    if (fs_1.default.existsSync(filePath)) {
        // Read the file content
        const fileContent = fs_1.default.readFileSync(filePath, "utf8");
        // Parse the JSON content
        const messages = JSON.parse(fileContent);
        // Filter the messages to include only the username and text
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const filteredMessages = messages.map(({ username, text, time, replyTo }) => ({
            username,
            text,
            time,
            replyTo,
        }));
        return filteredMessages;
    }
    else {
        throw ClientError_1.ClientError.notExistsError();
    }
};
exports.downloadAll = downloadAll;
const deleteAllChat = async (res) => {
    // Get the repository
    const repository = (0, config_1.getChatRepository)();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await repository.removeAll();
};
exports.deleteAllChat = deleteAllChat;
