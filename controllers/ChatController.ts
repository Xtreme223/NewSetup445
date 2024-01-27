import { Request, Response } from "express";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import { getChatRepository } from "../config/config";
import { Message } from "../models/Message";

const log = logger(__filename);

const getMessages = async (req: Request, res: Response): Promise<any> => {
    try {
        const repository = getChatRepository();
        const { limit, lastId } = req.body
        const messages: Message[] = await repository.getByPagination(limit, lastId);

        res.status(200).json(messages.reverse())
    } catch (error) {
        handleError(error, res);
    }
};

/**
 * Handles errors and sends appropriate HTTP responses.
 *
 * @param error - The error object to handle.
 * @param res - The HTTP response object to send the response.
 */
const handleError = (error: any, res: any): void => {
    if (error instanceof ClientError) {
        // Handle client errors with a 400 Bad Request status code
        res.status(400).send({ errorMessage: error.message });
    } else {
        // Log other errors and send a generic 500 Internal Server Error status code
        log.error(error);
        res.sendStatus(500);
    }
};


export {
    getMessages,
};
