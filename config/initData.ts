import { UserDto } from "../dtos/UserDto";
import { User } from "../models/User";
import { getRepository } from "./config";
import crypto from "crypto";
import logger from "../config/logger";
const log = logger(__filename);

const insertDummyAdminUser = async (): Promise<void> => {
  try {
    const users = await getRepository().get();
    const user = users.filter((user) => user.isSuperAdmin === true); // check if super admin exists

    if (user.length > 0) return; // admin id already exists

    log.info("creating admin user!");

    // creating dto instance because password hash function is not available at model
    const adminUserDto = new UserDto({ username: "admin", password: "admin" });
    adminUserDto.password = adminUserDto.getPasswordHash(); // password hash is generated

    // now create instance of the model with the dto that contains hashed password
    const adminUserModel = new User(adminUserDto);
    adminUserModel.id = crypto.randomUUID(); // generate random id
    adminUserModel.active = true; // set active
    adminUserModel.isAdmin = true; // set isAdmin
    adminUserModel.isSuperAdmin = true; // set isSuperAdmin

    const result = await getRepository().add(adminUserModel); // insert
    log.info(JSON.stringify(result));
  } catch (error) {
    // Handle the error here
    log.error("Error occurred during dummy admin user creation:", error);
  }
};

insertDummyAdminUser();
