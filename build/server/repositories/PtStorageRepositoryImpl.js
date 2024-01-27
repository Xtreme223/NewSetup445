"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PtStorageRepositoryImpl = void 0;
const ClientError_1 = require("../models/ClientError");
const logger_1 = __importDefault(require("../config/logger"));
const log = (0, logger_1.default)(__filename);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProtectedTextAPI = require("protectedtext-api"); // import "protectedtext-api" not works
// Function to load the tab manager for the site
async function loadTabManager(siteId, sitePassword) {
    try {
        const api = new ProtectedTextAPI(siteId, sitePassword);
        const tabManager = await api.loadTabs();
        return tabManager;
    }
    catch (error) {
        log.error("Error loading tabs:", error);
        throw ClientError_1.ClientError.connectionFailedError();
    }
}
class PtStorageRepositoryImpl {
    cachedUsers = null;
    siteId = "";
    sitePassword = "";
    tabManager = null;
    constructor(siteId, sitePassword) {
        this.siteId = siteId;
        this.sitePassword = sitePassword;
    }
    // Add a user to the repository
    async add(user) {
        const users = await this.getUsers();
        users.push(user);
        await this.saveUsers(users);
        return user;
    }
    // Get users from cache or load from tab manager
    async getUsers() {
        if (this.cachedUsers) {
            return this.cachedUsers; // return cached users
        }
        if (this.tabManager == null) {
            log.info("loading pt tab manager... please be patient!");
            this.tabManager = await loadTabManager(this.siteId, this.sitePassword);
        }
        const savedText = await this.tabManager.view();
        if (!savedText) {
            return [];
        }
        try {
            const users = savedText
                .split("\n")
                .filter(Boolean)
                .map((object) => JSON.parse(object));
            this.cachedUsers = users;
            return users;
        }
        catch (e) {
            throw new Error(`Error parsing JSON: ${e}`);
        }
    }
    // Get all users from the repository
    async get() {
        return this.getUsers();
    }
    // Get all users from the repository
    async getByPagination(limit, lastId) {
        return this.getUsers();
    }
    // Update a user in the repository
    async update(user) {
        const users = await this.getUsers();
        const updatedUsers = users.map((existingUser) => {
            if (existingUser.id === user.id) {
                return user;
            }
            return existingUser;
        });
        await this.saveUsers(updatedUsers);
        return user;
    }
    // Remove a user from the repository
    async remove(userId) {
        const users = await this.getUsers();
        const filteredUsers = users.filter((user) => user.id !== userId);
        await this.saveUsers(filteredUsers);
        return true;
    }
    // Save users to tab manager and update cache
    async saveUsers(users) {
        const updatedText = users
            .map((user) => JSON.stringify(user))
            .join("\n");
        if (this.tabManager == null) {
            log.info("loading pt tab manager... please be patient!");
            this.tabManager = await loadTabManager(this.siteId, this.sitePassword);
        }
        await this.tabManager.save(updatedText);
        this.cachedUsers = users; // update cache
    }
}
exports.PtStorageRepositoryImpl = PtStorageRepositoryImpl;
