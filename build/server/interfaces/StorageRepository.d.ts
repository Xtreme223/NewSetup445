interface StorageRepository<T> {
    add(item: T): Promise<T>;
    get(): Promise<T[]>;
    getByPagination(limit: number, id: number): Promise<T[]>;
    update(item: T): Promise<T>;
    remove(id: string): Promise<boolean>;
    removeAll?(): Promise<void>;
}
export { StorageRepository };
