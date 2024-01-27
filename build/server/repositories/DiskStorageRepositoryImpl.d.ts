import { StorageRepository } from "../interfaces/StorageRepository";
export declare class DiskStorageRepositoryImpl<T> implements StorageRepository<T> {
    private readonly modelName;
    private readonly filePath;
    private items;
    constructor(modelName: string);
    private assertDataFolderExists;
    private loadFromFile;
    private saveToFile;
    add: (item: T) => Promise<T>;
    get: () => Promise<T[]>;
    getByPagination: (limit: number, lastId: number) => Promise<any[]>;
    update: (item: T) => Promise<T>;
    remove: (id: string) => Promise<boolean>;
    removeAll: () => Promise<void>;
}
