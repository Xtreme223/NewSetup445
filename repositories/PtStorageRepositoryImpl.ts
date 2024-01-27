import { StorageRepository } from "../interfaces/StorageRepository";
import { User } from "../models/User";

import { ClientError } from "../models/ClientError";

import logger from "../config/logger";
const log = logger(__filename);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProtectedTextAPI = require("protectedtext-api"); // import "protectedtext-api" not works

// Function to load the tab manager for the site
async function loadTabManager(
  siteId: string,
  sitePassword: string
): Promise<any> {
  try {
    const api = new ProtectedTextAPI(siteId, sitePassword);
    const tabManager = await api.loadTabs();
    return tabManager;
  } catch (error) {
    log.error("Error loading tabs:", error);
    throw ClientError.connectionFailedError();
  }
}

export class PtStorageRepositoryImpl implements StorageRepository<User> {
  cachedUsers: User[] | null = null;
  siteId = "";
  sitePassword = "";
  tabManager: any = null;

  constructor(siteId: string, sitePassword: string) {
    this.siteId = siteId;
    this.sitePassword = sitePassword;
  }

  // Add a user to the repository
  async add(user: User): Promise<User> {
    const users: User[] = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
    return user;
  }
  // Get users from cache or load from tab manager
  async getUsers(): Promise<User[]> {
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
      const users: User[] = savedText
        .split("\n")
        .filter(Boolean)
        .map((object: string) => JSON.parse(object));
      this.cachedUsers = users;
      return users;
    } catch (e) {
      throw new Error(`Error parsing JSON: ${e}`);
    }
  }

  // Get all users from the repository
  async get(): Promise<User[]> {
    return this.getUsers();
  }

  // Get all users from the repository
  async getByPagination(limit: number, lastId: number): Promise<User[]> {
    return this.getUsers();
  }
  // Update a user in the repository
  async update(user: User): Promise<User> {
    const users: User[] = await this.getUsers();
    const updatedUsers: User[] = users.map((existingUser: User) => {
      if (existingUser.id === user.id) {
        return user;
      }
      return existingUser;
    });
    await this.saveUsers(updatedUsers);
    return user;
  }

  // Remove a user from the repository
  async remove(userId: string): Promise<boolean> {
    const users: User[] = await this.getUsers();
    const filteredUsers = users.filter((user: User) => user.id !== userId);
    await this.saveUsers(filteredUsers);
    return true;
  }

  // Save users to tab manager and update cache
  async saveUsers(users: User[]): Promise<void> {
    const updatedText: string = users
      .map((user: User) => JSON.stringify(user))
      .join("\n");

    if (this.tabManager == null) {
      log.info("loading pt tab manager... please be patient!");
      this.tabManager = await loadTabManager(this.siteId, this.sitePassword);
    }
    await this.tabManager.save(updatedText);

    this.cachedUsers = users; // update cache
  }
}
