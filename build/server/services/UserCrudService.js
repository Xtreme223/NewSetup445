"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLangPref = exports.updateSoundPref = exports.changePassword = exports.setLangPreference = exports.unsuspendUser = exports.suspendUser = exports.makeUserRegular = exports.makeUserAdmin = exports.removeUser = exports.getUserByUserName = exports.getUsers = exports.addUser = void 0;
const User_1 = require("../models/User");
const ClientError_1 = require("../models/ClientError");
const UserDto_1 = require("../dtos/UserDto");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
const log = (0, logger_1.default)(__filename);
const addUser = async (newUser) => {
    if (!newUser.isValidCredentials())
        throw ClientError_1.ClientError.invalidError();
    newUser.username = newUser.username?.trim();
    newUser.password = newUser.password?.trim();
    const userExists = await getUserByUserName(newUser.username);
    if (userExists && userExists.length === 1)
        throw ClientError_1.ClientError.duplicateError();
    newUser.id = crypto_1.default.randomUUID();
    newUser.password = newUser.getPasswordHash();
    const user = await (0, config_1.getRepository)().add(new User_1.User(newUser));
    log.info("anonymous user created new user with %s", user);
    const userDto = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(user) // returns user model
    ); // returns user dto
    return userDto;
};
exports.addUser = addUser;
const getUsers = async () => {
    const users = await (0, config_1.getRepository)().get();
    const userDto = users.map((json) => new UserDto_1.UserDto(json)); // returns UserDto[]
    return userDto;
};
exports.getUsers = getUsers;
const getUserById = async (userId) => {
    const users = await (0, config_1.getRepository)().get();
    const user = users.find((user) => user.id === userId);
    if (!user) {
        throw ClientError_1.ClientError.notExistsError();
    }
    return user;
};
const getUserByUserName = async (username) => {
    const users = await (0, config_1.getRepository)().get();
    const user = users.filter((user) => user.username === username);
    // returning array instead of object is intentional because
    // the caller is dependent on the type of array
    // no error checking here is intentional because the caller handles the error case
    return user;
};
exports.getUserByUserName = getUserByUserName;
const removeUser = async (userId) => {
    // Check userId is valid or not
    const user = await getUserById(userId);
    assertNotSuperAdmin(user); // super admin user can't be removed
    return await (0, config_1.getRepository)().remove(userId);
};
exports.removeUser = removeUser;
// make user admin
const makeUserAdmin = async (userId) => {
    const user = await getUserById(userId);
    assertNotSuperAdmin(user); // super admin user can't be updated
    user.isAdmin = true; // set isAdmin to true
    const userDto = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(user) // returns user model
    );
    return userDto;
};
exports.makeUserAdmin = makeUserAdmin;
// make user regular
const makeUserRegular = async (userId) => {
    const user = await getUserById(userId);
    assertNotSuperAdmin(user); // super admin user can't be updated
    user.isAdmin = false; // set is Admin to false
    const userDto = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(user) // returns user model
    ); // returns user dto
    return userDto;
};
exports.makeUserRegular = makeUserRegular;
const suspendUser = async (userId) => {
    const user = await getUserById(userId);
    assertNotSuperAdmin(user); // super admin user can't be updated
    user.active = false; // set isAdmin to false
    const userDto = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(user) // returns user model
    ); // returns user dto
    return userDto;
};
exports.suspendUser = suspendUser;
const unsuspendUser = async (userId) => {
    const user = await getUserById(userId);
    assertNotSuperAdmin(user); // super admin user can't be updated
    user.active = true; // set isAdmin to true
    const userDto = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(user) // returns user model
    ); // returns user dto
    return userDto;
};
exports.unsuspendUser = unsuspendUser;
// set language preference
const setLangPreference = async (username, langPref) => {
    const user = await getUserByUserName(username);
    if (user.length === 0)
        return false; // ignore
    user[0].langPref = langPref; // set language preference
    await (0, config_1.getRepository)().update(user[0]);
    log.info("langPref updated successfully with %s", user);
    return true;
};
exports.setLangPreference = setLangPreference;
const changePassword = async (userDto) => {
    const user = await getUserByUserName(userDto.username);
    if (user.length === 0) {
        throw ClientError_1.ClientError.notExistsError();
    }
    const updatedUser = user[0];
    updatedUser.password = userDto.password;
    const result = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(updatedUser));
    return result;
};
exports.changePassword = changePassword;
const updateSoundPref = async (userDto) => {
    const user = await getUserByUserName(userDto.username);
    if (user.length === 0) {
        throw ClientError_1.ClientError.notExistsError();
    }
    const updatedUser = user[0];
    updatedUser.soundPref = userDto.soundPref;
    const result = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(updatedUser));
    return result;
};
exports.updateSoundPref = updateSoundPref;
const updateLangPref = async (userDto) => {
    const user = await getUserByUserName(userDto.username);
    if (user.length === 0) {
        throw ClientError_1.ClientError.notExistsError();
    }
    const updatedUser = user[0];
    updatedUser.langPref = userDto.langPref;
    const result = new UserDto_1.UserDto(await (0, config_1.getRepository)().update(updatedUser));
    return result;
};
exports.updateLangPref = updateLangPref;
/**
 * Ensures that the provided user is not a super admin.
 * If the user is a super admin, an error is thrown to prevent further execution.
 *
 * @param {User} user - The user object to be checked.
 * @throws {InvalidOperationError} Thrown if the user is a super admin.
 */
const assertNotSuperAdmin = (user) => {
    if (user.isSuperAdmin) {
        log.warn("Attempting to update / remove super admin user");
        throw ClientError_1.ClientError.invalidError();
    }
};
