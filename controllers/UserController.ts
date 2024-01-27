import { Request, Response } from "express";
import { ClientError } from "../models/ClientError";
import logger from "../config/logger";
import { UserDto } from "../dtos/UserDto";
import * as userCrudService from "../services/UserCrudService";

const log = logger(__filename);

const getLoggedInUserInfo = async (req: Request, res: Response) => {
  res.json(req.session.userInfo);
};

const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userDto = new UserDto(req.body);

    await userCrudService.addUser(userDto);

    res.sendStatus(200);
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(400).json({
        message: error.message
      });
    } else {
      log.error(error);
      res.sendStatus(500);
    }
  }
};

const getUsers = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Getting users...");

  try {
    // keeping here to handle errors if any
    const users = await userCrudService.getUsers();
    log.info(JSON.stringify(users, null, 2));
    log.debug("Users retrieved successfully.");
    res.status(200).json(users)
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(400).json({
        message: error.message
      });
    } else {
      log.error(error);
      res.sendStatus(500);
    }
  }
};

const removeUser = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Removing user...");
  const userId: string = req.params.id;

  try {
    // keeping here to handle errors if any
    await userCrudService.removeUser(userId);
    log.debug("User removed successfully.");
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

const makeUserAdmin = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Making user admin...");
  const userId: string = req.params.id;

  try {
    // keeping here to handle errors if any
    const updateUser = await userCrudService.makeUserAdmin(userId);
    log.debug("User made admin successfully.");
    res.status(200).json(updateUser);
  } catch (error) {
    handleError(error, res);
  }
};

const makeUserRegular = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Making user regular...");
  const userId: string = req.params.id;

  try {
    // keeping here to handle errors if any
    const updateUser = await userCrudService.makeUserRegular(userId);
    log.debug("User made regular successfully.");
    res.status(200).json(updateUser);
  } catch (error) {
    handleError(error, res);
  }
};

const suspendUser = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Suspending user...");
  const userId: string = req.params.id;

  try {
    // keeping here to handle errors if any
    const updateUser = await userCrudService.suspendUser(userId);
    log.debug("User suspended successfully.");
    res.status(200).json(updateUser);
  } catch (error) {
    handleError(error, res);
  }
};

const unsuspendUser = async (req: Request, res: Response): Promise<any> => {
  if (!req.session?.userInfo?.isAdmin) return res.sendStatus(403);

  log.debug("Unsuspending user...");
  const userId: string = req.params.id;

  try {
    // keeping here to handle errors if any
    const updateUser = await userCrudService.unsuspendUser(userId);
    log.debug("User unsuspended successfully.");
    res.status(200).json(updateUser);
  } catch (error) {
    handleError(error, res);
  }
};

const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const userDto = new UserDto(req.body);

    userDto.username = req.session?.userInfo?.username;
    userDto.password = userDto.getPasswordHash();

    const updatedUser = await userCrudService.changePassword(userDto);

    log.debug("Password updated successfully.");
    res.status(200).json(updatedUser);
  } catch (error) {
    handleError(error, res);
  }
};

const updateSoundPref = async (req: Request, res: Response): Promise<any> => {
  try {
    const userDto = new UserDto(req.body);

    userDto.username = req.session?.userInfo?.username;

    const updatedUser = await userCrudService.updateSoundPref(userDto);

    // update the soundPref to session
    req.session.userInfo.soundPref = updatedUser.soundPref;

    log.debug("SoundPref updated successfully.");
    res.status(200).json(updatedUser);
  } catch (error) {
    handleError(error, res);
  }
};

const updateLangPref = async (req: Request, res: Response): Promise<any> => {
  try {
    const userDto = new UserDto(req.body);

    userDto.username = req.session?.userInfo?.username;

    const updatedUser = await userCrudService.updateLangPref(userDto);

    // update the langPref to session
    req.session.userInfo.langPref = updatedUser.langPref;

    log.debug("LangPref updated successfully.");
    res.status(200).json(updatedUser);
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
    res.status(400).json({ message: error.message });
  } else {
    // Log other errors and send a generic 500 Internal Server Error status code
    log.error(error);
    res.sendStatus(500);
  }
};

export {
  getLoggedInUserInfo,
  addUser,
  getUsers,
  removeUser,
  makeUserAdmin,
  makeUserRegular,
  suspendUser,
  unsuspendUser,
  changePassword,
  updateSoundPref,
  updateLangPref,
};
