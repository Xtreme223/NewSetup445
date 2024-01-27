import bcrypt from "bcrypt";
import { ClientError } from "../models/ClientError";
import { UserDto } from "../dtos/UserDto";
import * as userCrudService from "../services/UserCrudService";
import { User } from "../models/User";
import logger from "../config/logger";
import { getRepository } from "../config/config";

const log = logger(__filename);

const login = async (user: UserDto): Promise<UserDto> => {
  if (!user.isValidCredentials()) throw ClientError.invalidCredentials();
  log.debug("login called");

  const result: User[] = await userCrudService.getUserByUserName(user.username);

  if (!result || result.length != 1) throw ClientError.notExistsError();

  if (!result[0].active) {
    log.debug("login failed, User Inactive");
    throw ClientError.inactiveUser();
  }

  const compare: boolean = await comparePass(user.password, result[0].password);
  if (!compare) throw ClientError.WrongPassword();

  const userDto: UserDto = new UserDto(
    result[0] // returns user model
  ); // returns user dto

  result[0].lastLoginDate = new Date().toISOString();
  await getRepository().update(result[0])

  return userDto;
};

const comparePass = async (
  plainTextPass: string,
  hashPass: string
): Promise<boolean> => {
  if (!plainTextPass && !hashPass)
    throw new Error("Empty plainTextPass or hashPass");

  return await bcrypt.compare(plainTextPass, hashPass);
};

export { login };
