"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHijri = exports.deleteChat = exports.canWeChat = exports.disableChat = exports.enableChat = exports.downloadFormatted = exports.downloadChat = exports.updateNotice = exports.getNotice = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const ClientError_1 = require("../models/ClientError");
const ChatService_1 = require("../services/ChatService");
const config_1 = require("../config/config");
const SettingService_1 = require("../services/SettingService");
const log = (0, logger_1.default)(__filename);
const getNotice = async (req, res) => {
    try {
        const repository = (0, config_1.getSettingRepository)();
        const settings = await repository.get();
        const setting = settings[0];
        res.status(200).json({ notice: setting.notice });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.getNotice = getNotice;
const updateNotice = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("updating notice");
    try {
        const repository = (0, config_1.getSettingRepository)();
        const settings = await repository.get();
        const setting = settings[0];
        setting.notice = req.body.notice;
        await repository.update(setting);
        res.sendStatus(200);
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.updateNotice = updateNotice;
const enableChat = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("enabling chat");
    try {
        const repository = (0, config_1.getSettingRepository)();
        const settings = await repository.get();
        const setting = settings[0];
        setting.chatState = true;
        await repository.update(setting);
        res.sendStatus(200);
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.enableChat = enableChat;
const disableChat = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("disabling chat");
    try {
        const repository = (0, config_1.getSettingRepository)();
        const settings = await repository.get();
        const setting = settings[0];
        setting.chatState = false;
        await repository.update(setting);
        res.sendStatus(200);
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.disableChat = disableChat;
const canWeChat = async (req, res) => {
    try {
        const repository = (0, config_1.getSettingRepository)();
        const settings = await repository.get();
        const setting = settings[0];
        const peopleCanChat = setting.chatState;
        res.status(200).json({ peopleCanChat });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.canWeChat = canWeChat;
const deleteChat = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("Deleting all messages...");
    try {
        await (0, ChatService_1.deleteAllChat)(res);
        log.debug("all messages deleted successfully.");
        res.sendStatus(200);
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.deleteChat = deleteChat;
const downloadChat = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("Downloading all messages...");
    try {
        await (0, ChatService_1.downloadJson)(res);
        log.debug("all messages downloaded successfully.");
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.downloadChat = downloadChat;
const downloadFormatted = async (req, res) => {
    if (!req.session?.userInfo?.isAdmin)
        return res.sendStatus(403);
    log.debug("Downloading all messages...");
    try {
        const messages = await (0, ChatService_1.downloadAll)();
        log.debug("all messages downloaded successfully.");
        res.status(200).json(messages);
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.downloadFormatted = downloadFormatted;
async function getHijri(req, res) {
    try {
        let hijri = await (0, SettingService_1.getHijriDate)();
        res.status(200).json({ hijri });
    }
    catch (error) {
        handleError(error, res);
    }
}
exports.getHijri = getHijri;
/**
 * Handles errors and sends appropriate HTTP responses.
 *
 * @param error - The error object to handle.
 * @param res - The HTTP response object to send the response.
 */
const handleError = (error, res) => {
    if (error instanceof ClientError_1.ClientError) {
        // Handle client errors with a 400 Bad Request status code
        res.status(400).send({ errorMessage: error.message });
    }
    else {
        // Log other errors and send a generic 500 Internal Server Error status code
        log.error(error);
        res.sendStatus(500);
    }
};
const initializeSetting = async () => {
    const repository = (0, config_1.getSettingRepository)();
    const settings = await repository.get();
    if (settings && settings.length) {
        return;
    }
    const initalData = {
        id: "1",
        chatState: true,
        notice: "",
        autoIncrement: 1,
        hijri: {
            date: "",
            lastUpdate: "",
        },
    };
    await repository.add(initalData);
};
initializeSetting();
