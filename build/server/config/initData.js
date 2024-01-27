"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDto_1 = require("../dtos/UserDto");
const User_1 = require("../models/User");
const config_1 = require("./config");
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = __importDefault(require("../config/logger"));
const log = (0, logger_1.default)(__filename);
const insertDummyAdminUser = async () => {
    try {
        const users = await (0, config_1.getRepository)().get();
        const user = users.filter((user) => user.isSuperAdmin === true); // check if super admin exists
        if (user.length > 0)
            return; // admin id already exists
        log.info("creating admin user!");
        // creating dto instance because password hash function is not available at model
        const adminUserDto = new UserDto_1.UserDto({ username: "admin", password: "admin" });
        adminUserDto.password = adminUserDto.getPasswordHash(); // password hash is generated
        // now create instance of the model with the dto that contains hashed password
        const adminUserModel = new User_1.User(adminUserDto);
        adminUserModel.id = crypto_1.default.randomUUID(); // generate random id
        adminUserModel.active = true; // set active
        adminUserModel.isAdmin = true; // set isAdmin
        adminUserModel.isSuperAdmin = true; // set isSuperAdmin
        const result = await (0, config_1.getRepository)().add(adminUserModel); // insert
        log.info(JSON.stringify(result));
    }
    catch (error) {
        // Handle the error here
        log.error("Error occurred during dummy admin user creation:", error);
    }
};
insertDummyAdminUser();
