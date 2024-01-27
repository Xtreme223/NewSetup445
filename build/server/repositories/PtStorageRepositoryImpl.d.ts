import { StorageRepository } from "../interfaces/StorageRepository";
import { User } from "../models/User";
export declare class PtStorageRepositoryImpl implements StorageRepository<User> {
    cachedUsers: User[] | null;
    siteId: string;
    sitePassword: string;
    tabManager: any;
    constructor(siteId: string, sitePassword: string);
    add(user: User): Promise<User>;
    getUsers(): Promise<User[]>;
    get(): Promise<User[]>;
    getByPagination(limit: number, lastId: number): Promise<User[]>;
    update(user: User): Promise<User>;
    remove(userId: string): Promise<boolean>;
    saveUsers(users: User[]): Promise<void>;
}
