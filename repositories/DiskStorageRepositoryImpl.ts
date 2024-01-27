import { StorageRepository } from "../interfaces/StorageRepository";
import * as fs from "fs";
import * as path from "path";

const DATA_FOLDER = "data"; // Folder to store the JSON files

export class DiskStorageRepositoryImpl<T> implements StorageRepository<T> {
  private readonly filePath: string;
  private items: T[] = [];

  constructor(private readonly modelName: string) {
    this.filePath = path.join(DATA_FOLDER, `${this.modelName}.json`);
    this.assertDataFolderExists();
    this.loadFromFile();
  }

  private assertDataFolderExists(): void {
    if (!fs.existsSync(DATA_FOLDER)) {
      fs.mkdirSync(DATA_FOLDER);
    }
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf8");
        this.items = JSON.parse(data);
      } else {
        this.items = [];
      }
    } catch (error) {
      // If an error occurs while reading the file, assume an empty array
      this.items = [];
    }
  }

  private saveToFile(): void {
    const data = JSON.stringify(this.items, null, 2);
    fs.writeFileSync(this.filePath, data, "utf8");
  }

  add = async (item: T): Promise<T> => {
    this.items.push(item);
    this.saveToFile();
    return item;
  };

  get = async (): Promise<T[]> => {
    return this.items;
  };

  // only for chatRepository
  getByPagination = async (limit: number, lastId: number): Promise<any[]> => {
    const sortedItems = [...this.items as any[]].sort((a, b) => b.id - a.id);

    let returnedItems = []
    if (lastId === 0) {
      returnedItems = sortedItems.slice(0, limit);
    } else {
      returnedItems = sortedItems.filter(item => item.id < lastId).slice(0, limit);
    }
    return returnedItems;
  };

  update = async (item: T): Promise<T> => {
    const index = this.items.findIndex((existingItem: T) => {
      return (existingItem as any).id === (item as any).id;
    });

    if (index !== -1) {
      this.items[index] = item;
      this.saveToFile();
      return item;
    }

    throw new Error("Item not found.");
  };

  remove = async (id: string): Promise<boolean> => {
    const index = this.items.findIndex((item: T) => {
      return (item as any).id === id;
    });

    if (index !== -1) {
      this.items.splice(index, 1);
      this.saveToFile();
      return true;
    }

    return false;
  };

  removeAll = async (): Promise<void> => {
    this.items = []; // clear all items
    this.saveToFile(); // save
  };
}
