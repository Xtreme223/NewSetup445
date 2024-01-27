import logger from "../config/logger";
import { StorageRepository } from "../interfaces/StorageRepository";
import { ClientError } from "../models/ClientError";
import { Message } from "../models/Message";
import { Setting } from "../models/Setting";
import { User } from "../models/User";
import { DiskStorageRepositoryImpl } from "../repositories/DiskStorageRepositoryImpl";
import { PtStorageRepositoryImpl } from "../repositories/PtStorageRepositoryImpl";
const log = logger(__filename);

let repository: StorageRepository<User> | null = null;

// singeleton idea:
// https://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-a-singleton-in-javascript

function getRepository(): StorageRepository<User> {
  if (!repository) {
    const repositoryName = process.env.REPOSITORY_NAME || "ptStorage";
    log.info("initializing repository");

    try {
      switch (repositoryName) {
        case "ptStorage": {
          log.info("Pt has been chosen as the default repository");
          const siteId = process.env.PT_SITE_ID ?? "";
          const sitePassword = process.env.PT_SITE_PASSWORD ?? "";
          log.info("found siteId: %s & sitePass: %s", siteId, sitePassword);
          repository = new PtStorageRepositoryImpl(siteId, sitePassword);
          break;
        }
        case "diskStorage":
          log.info("Disk Storage has been chosen as the default repository");
          repository = new DiskStorageRepositoryImpl<User>("User");
          break;

        default: // add more cases for other repository types as needed
          log.error(`Invalid repository name: ${repositoryName}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(`Error creating repository: ${error.message}`);
    }
  }

  if (!repository) {
    log.error("Could not instantiate repository");
    // we throw a "connection failed" error, since we have observed that
    // such errors can be caused by connection issues.
    throw ClientError.connectionFailedError();
  }

  return repository;
}

/* 
TODO: This should be merged with getRepository but it's taking time to implement 
now. Plan to implement after MVP inshaAllah 
note: by default chatRepository is using DiskStorage
*/
let chatRepository: StorageRepository<Message> | null = null;

function getChatRepository(): StorageRepository<Message> {
  if (!chatRepository) {
    log.info("initializing repository");

    try {
      chatRepository = new DiskStorageRepositoryImpl<Message>("Message");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(`Error creating chatRepository: ${error.message}`);
      throw error;
    }
  }

  return chatRepository;
}

let settingRepository: StorageRepository<Setting> | null = null;

function getSettingRepository(): StorageRepository<Setting> {
  if (!settingRepository) {
    log.info("initializing repository");

    try {
      settingRepository = new DiskStorageRepositoryImpl<Setting>("Setting");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(`Error creating settingRepository: ${error.message}`);
      throw error;
    }
  }

  return settingRepository;
}

export {
  getRepository,
  getChatRepository,
  getSettingRepository
};
