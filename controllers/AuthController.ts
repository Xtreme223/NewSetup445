import { Request, Response } from "express";
import logger from "../config/logger";
import { ClientError } from "../models/ClientError";
import * as authService from "../services/AuthService";
import { SessionUser, UserDto } from "../dtos/UserDto";
import { destroySocketSession } from "../bin/www";
const log = logger(__filename);

const login = async (req: Request, res: Response) => {
  const username = req.body.username;
  const userPass = req.body.password;
  if (!username || !userPass) {
    return res.sendStatus(400)
  }
  const userDto = new UserDto({
    username: username,
    password: userPass,
  });

  try {
    // keeping here to handle errors if any
    const user = await authService.login(userDto);
    await setSession(req, user);
    req.session.authenticated = true;
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

const logout = async (req: Request, res: Response): Promise<any> => {
  if (!req.session.userInfo || !req.session.userInfo.username)
    return res.sendStatus(403)

  try {
    // first destroy socket session
    destroySocketSession(req.session.id);
    // now destroy express session
    await destroySession(req);
    res.status(200).json({
      message: "Logout Successfull",
    });
  } catch (error) {
    let message = "";
    if (error instanceof Error) {
      log.error(error.message);
      message = error.message;
    }
    res.status(400).send(message);
  }
};

const setSession = async (req: Request, user: UserDto): Promise<void> => {
  if (!user.username) {
    log.error("user.username is missing");
    throw ClientError.invalidError();
  }
  req.session.userInfo = new SessionUser(
    user.id,
    user.username,
    user.langPref,
    user.active,
    user.isAdmin,
    user.soundPref
  );

  log.debug(`login sessionId: ${req.sessionID}`);
  log.debug(`login session ${JSON.stringify(req.session)}`);
};

const destroySession = async (req: Request): Promise<void> => {
  if (!req.session) {
    log.error("req.session is missing");
    throw ClientError.invalidError();
  }
  log.debug(`before logout sessionId: ${req.sessionID}`);
  req.session.destroy(function (err) {
    if (err) log.error(err);
  });
  log.debug(`after logout sessionId: ${req.sessionID}`);
};

export { login, logout, setSession };
