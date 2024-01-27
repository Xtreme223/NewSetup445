import { Request, Response } from "express";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import { downloadAll, deleteAllChat, downloadJson } from "../services/ChatService";
import { getSettingRepository } from "../config/config";
import { Setting } from "../models/Setting";
import { getHijriDate } from "../services/SettingService";

const log = logger(__filename);

const getNotice = async (req: Request, res: Response): Promise<any> => {
  try {
    const repository = getSettingRepository();

    const settings: Setting[] = await repository.get();
    const setting: Setting = settings[0];
    res.status(200).json({ notice: setting.notice })
  } catch (error) {
    handleError(error, res);
  }
};

const updateNotice = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("updating notice");
  try {
    const repository = getSettingRepository();

    const settings: Setting[] = await repository.get();
    const setting: Setting = settings[0];
    setting.notice = req.body.notice;

    await repository.update(setting);
    res.sendStatus(200)
  } catch (error) {
    handleError(error, res);
  }
};

const enableChat = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("enabling chat");
  try {
    const repository = getSettingRepository();

    const settings: Setting[] = await repository.get();
    const setting: Setting = settings[0];
    setting.chatState = true;

    await repository.update(setting);
    res.sendStatus(200)
  } catch (error) {
    handleError(error, res);
  }
};

const disableChat = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("disabling chat");
  try {
    const repository = getSettingRepository();

    const settings: Setting[] = await repository.get();
    const setting: Setting = settings[0];
    setting.chatState = false;

    await repository.update(setting);
    res.sendStatus(200)
  } catch (error) {
    handleError(error, res);
  }
};

const canWeChat = async (req: Request, res: Response): Promise<any> => {
  try {

    const repository = getSettingRepository();

    const settings: Setting[] = await repository.get();
    const setting: Setting = settings[0];
    const peopleCanChat = setting.chatState;
    res.status(200).json({ peopleCanChat })
  } catch (error) {
    handleError(error, res);
  }
};

const deleteChat = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Deleting all messages...");

  try {
    await deleteAllChat(res);
    log.debug("all messages deleted successfully.");
    res.sendStatus(200)
  } catch (error) {
    handleError(error, res);
  }
};

const downloadChat = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Downloading all messages...");

  try {
    await downloadJson(res);
    log.debug("all messages downloaded successfully.");
  } catch (error) {
    handleError(error, res);
  }
};

const downloadFormatted = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Downloading all messages...");

  try {
    const messages = await downloadAll();
    log.debug("all messages downloaded successfully.");
    res.status(200).json(messages)
  } catch (error) {
    handleError(error, res);
  }
};

async function getHijri(req: Request, res: Response) {
  try {
    let hijri = await getHijriDate();
    res.status(200).json({ hijri });
  } catch (error) {
    handleError(error, res);
  }
}

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

const initializeSetting = async (): Promise<any> => {
  const repository = getSettingRepository();

  const settings: Setting[] = await repository.get();
  if (settings && settings.length) {
    return
  }
  const initalData: Setting = {
    id: "1",
    chatState: true,
    notice: "",
    autoIncrement: 1,
    hijri: {
      date: "",
      lastUpdate: "",
    },
  }
  await repository.add(initalData)
};

initializeSetting()

export {
  getNotice,
  updateNotice,
  downloadChat,
  downloadFormatted,
  enableChat,
  disableChat,
  canWeChat,
  deleteChat,
  getHijri,
};
