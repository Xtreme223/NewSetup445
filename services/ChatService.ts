import logger from "../config/logger";
import path from "path";
import fs from "fs";
import { Response } from "express";
import { ClientError } from "../models/ClientError";
import { Readable } from "stream";
import { getChatRepository } from "../config/config";

const log = logger(__filename);

// Download JSON file with filtered messages
const downloadJson = async (res: Response): Promise<void> => {
  log.debug("download all called");

  const DATA_FOLDER = "data"; // Folder to store the JSON files
  const filePath = path.join(DATA_FOLDER, `Message.json`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

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
      })
    );

    // Convert the filtered messages to JSON string
    const filteredJson = JSON.stringify(filteredMessages, null, 2);

    // Set the appropriate headers for the download
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=Message.json");

    // Create a readable stream from the filtered JSON content
    const filteredStream = new Readable();
    filteredStream.push(filteredJson);
    filteredStream.push(null);

    // Pipe the filtered stream to the response
    filteredStream.pipe(res);
  } else {
    throw ClientError.notExistsError();
  }
};

// Download JSON file with filtered messages
const downloadAll = async (): Promise<any> => {
  log.debug("download all called");

  const DATA_FOLDER = "data"; // Folder to store the JSON files
  const filePath = path.join(DATA_FOLDER, `Message.json`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

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
      })
    );

    return filteredMessages
  } else {
    throw ClientError.notExistsError();
  }
};

const deleteAllChat = async (res: Response): Promise<void> => {
  // Get the repository
  const repository = getChatRepository();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  await repository.removeAll();
};

export { downloadJson, downloadAll, deleteAllChat };