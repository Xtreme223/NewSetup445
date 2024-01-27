import { User } from "../models/User";
import { ClientError } from "../models/ClientError";
import { UserDto } from "../dtos/UserDto";
import crypto from "crypto";
import { getRepository } from "../config/config";
import logger from "../config/logger";
const log = logger(__filename);

const addUser = async (newUser: UserDto): Promise<UserDto> => {
  if (!newUser.isValidCredentials()) throw ClientError.invalidError();
  newUser.username = newUser.username?.trim();
  newUser.password = newUser.password?.trim();

  const userExists: User[] = await getUserByUserName(newUser.username);

  if (userExists && userExists.length === 1) throw ClientError.duplicateError();

  newUser.id = crypto.randomUUID();
  newUser.password = newUser.getPasswordHash();

  const user: User = await getRepository().add(new User(newUser));

  log.info("anonymous user created new user with %s", user);

  const userDto: UserDto = new UserDto(
    await getRepository().update(user) // returns user model
  ); // returns user dto

  return userDto;
};

const getUsers = async (): Promise<UserDto[]> => {
  const users: User[] = await getRepository().get();

  const userDto: UserDto[] = users.map(
    (json) => new UserDto(json)
  ); // returns UserDto[]
  return userDto;
};

const getUserById = async (userId: string): Promise<User> => {
  const users: User[] = await getRepository().get();
  const user: User | undefined = users.find((user) => user.id === userId);
  if (!user) {
    throw ClientError.notExistsError();
  }
  return user;
};

const getUserByUserName = async (username: string): Promise<User[]> => {
  const users: User[] = await getRepository().get();
  const user: User[] = users.filter((user) => user.username === username);
  // returning array instead of object is intentional because
  // the caller is dependent on the type of array
  // no error checking here is intentional because the caller handles the error case
  return user;
};

const removeUser = async (userId: string): Promise<boolean> => {
  // Check userId is valid or not
  const user: User = await getUserById(userId);

  assertNotSuperAdmin(user); // super admin user can't be removed

  return await getRepository().remove(userId);
};

// make user admin
const makeUserAdmin = async (userId: string): Promise<UserDto> => {
  const user: User = await getUserById(userId);

  assertNotSuperAdmin(user); // super admin user can't be updated

  user.isAdmin = true; // set isAdmin to true

  const userDto: UserDto = new UserDto(
    await getRepository().update(user) // returns user model
  );

  return userDto;
};

// make user regular
const makeUserRegular = async (userId: string): Promise<UserDto> => {
  const user: User = await getUserById(userId);

  assertNotSuperAdmin(user); // super admin user can't be updated

  user.isAdmin = false; // set is Admin to false

  const userDto: UserDto = new UserDto(
    await getRepository().update(user) // returns user model
  ); // returns user dto

  return userDto;
};

const suspendUser = async (userId: string): Promise<UserDto> => {
  const user: User = await getUserById(userId);

  assertNotSuperAdmin(user); // super admin user can't be updated

  user.active = false; // set isAdmin to false

  const userDto: UserDto = new UserDto(
    await getRepository().update(user) // returns user model
  ); // returns user dto

  return userDto;
};

const unsuspendUser = async (userId: string): Promise<UserDto> => {
  const user: User = await getUserById(userId);

  assertNotSuperAdmin(user); // super admin user can't be updated

  user.active = true; // set isAdmin to true

  const userDto: UserDto = new UserDto(
    await getRepository().update(user) // returns user model
  ); // returns user dto

  return userDto;
};

// set language preference
const setLangPreference = async (
  username: string,
  langPref: string
): Promise<boolean> => {
  const user: User[] = await getUserByUserName(username);
  if (user.length === 0) return false; // ignore
  user[0].langPref = langPref; // set language preference
  await getRepository().update(user[0]);
  log.info("langPref updated successfully with %s", user);
  return true;
};

const changePassword = async (
  userDto: UserDto
): Promise<UserDto> => {
  const user: User[] = await getUserByUserName(userDto.username);

  if (user.length === 0) {
    throw ClientError.notExistsError();
  }

  const updatedUser = user[0];
  updatedUser.password = userDto.password;

  const result: UserDto = new UserDto(
    await getRepository().update(updatedUser)
  );

  return result;
};

const updateSoundPref = async (
  userDto: UserDto
): Promise<UserDto> => {
  const user: User[] = await getUserByUserName(userDto.username);

  if (user.length === 0) {
    throw ClientError.notExistsError();
  }

  const updatedUser = user[0];
  updatedUser.soundPref = userDto.soundPref;

  const result: UserDto = new UserDto(
    await getRepository().update(updatedUser)
  );

  return result;
};

const updateLangPref = async (
  userDto: UserDto
): Promise<UserDto> => {
  const user: User[] = await getUserByUserName(userDto.username);

  if (user.length === 0) {
    throw ClientError.notExistsError();
  }

  const updatedUser = user[0];
  updatedUser.langPref = userDto.langPref;

  const result: UserDto = new UserDto(
    await getRepository().update(updatedUser)
  );

  return result;
};

/**
 * Ensures that the provided user is not a super admin.
 * If the user is a super admin, an error is thrown to prevent further execution.
 *
 * @param {User} user - The user object to be checked.
 * @throws {InvalidOperationError} Thrown if the user is a super admin.
 */
const assertNotSuperAdmin = (user: User): void => {
  if (user.isSuperAdmin) {
    log.warn("Attempting to update / remove super admin user");
    throw ClientError.invalidError();
  }
};

export {
  addUser,
  getUsers,
  getUserByUserName,
  removeUser,
  makeUserAdmin,
  makeUserRegular,
  suspendUser,
  unsuspendUser,
  setLangPreference,
  changePassword,
  updateSoundPref,
  updateLangPref,
};
