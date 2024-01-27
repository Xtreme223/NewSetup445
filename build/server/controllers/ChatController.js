"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const ClientError_1 = require("../models/ClientError");
const config_1 = require("../config/config");
const log = (0, logger_1.default)(__filename);
const getMessages = async (req, res) => {
    try {
        const repository = (0, config_1.getChatRepository)();
        const { limit, lastId } = req.body;
        const messages = await repository.getByPagination(limit, lastId);
        res.status(200).json(messages.reverse());
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.getMessages = getMessages;
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
