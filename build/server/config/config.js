"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingRepository = exports.getChatRepository = exports.getRepository = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const ClientError_1 = require("../models/ClientError");
const DiskStorageRepositoryImpl_1 = require("../repositories/DiskStorageRepositoryImpl");
const PtStorageRepositoryImpl_1 = require("../repositories/PtStorageRepositoryImpl");
const log = (0, logger_1.default)(__filename);
let repository = null;
// singeleton idea:
// https://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-a-singleton-in-javascript
function getRepository() {
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
                    repository = new PtStorageRepositoryImpl_1.PtStorageRepositoryImpl(siteId, sitePassword);
                    break;
                }
                case "diskStorage":
                    log.info("Disk Storage has been chosen as the default repository");
                    repository = new DiskStorageRepositoryImpl_1.DiskStorageRepositoryImpl("User");
                    break;
                default: // add more cases for other repository types as needed
                    log.error(`Invalid repository name: ${repositoryName}`);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            log.error(`Error creating repository: ${error.message}`);
        }
    }
    if (!repository) {
        log.error("Could not instantiate repository");
        // we throw a "connection failed" error, since we have observed that
        // such errors can be caused by connection issues.
        throw ClientError_1.ClientError.connectionFailedError();
    }
    return repository;
}
exports.getRepository = getRepository;
/*
TODO: This should be merged with getRepository but it's taking time to implement
now. Plan to implement after MVP inshaAllah
note: by default chatRepository is using DiskStorage
*/
let chatRepository = null;
function getChatRepository() {
    if (!chatRepository) {
        log.info("initializing repository");
        try {
            chatRepository = new DiskStorageRepositoryImpl_1.DiskStorageRepositoryImpl("Message");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            log.error(`Error creating chatRepository: ${error.message}`);
            throw error;
        }
    }
    return chatRepository;
}
exports.getChatRepository = getChatRepository;
let settingRepository = null;
function getSettingRepository() {
    if (!settingRepository) {
        log.info("initializing repository");
        try {
            settingRepository = new DiskStorageRepositoryImpl_1.DiskStorageRepositoryImpl("Setting");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            log.error(`Error creating settingRepository: ${error.message}`);
            throw error;
        }
    }
    return settingRepository;
}
exports.getSettingRepository = getSettingRepository;
