import { StorageRepository } from "../interfaces/StorageRepository";
import { Message } from "../models/Message";
import { Setting } from "../models/Setting";
import { User } from "../models/User";
declare function getRepository(): StorageRepository<User>;
declare function getChatRepository(): StorageRepository<Message>;
declare function getSettingRepository(): StorageRepository<Setting>;
export { getRepository, getChatRepository, getSettingRepository };
