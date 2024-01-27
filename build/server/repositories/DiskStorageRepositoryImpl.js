"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskStorageRepositoryImpl = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DATA_FOLDER = "data"; // Folder to store the JSON files
class DiskStorageRepositoryImpl {
    modelName;
    filePath;
    items = [];
    constructor(modelName) {
        this.modelName = modelName;
        this.filePath = path.join(DATA_FOLDER, `${this.modelName}.json`);
        this.assertDataFolderExists();
        this.loadFromFile();
    }
    assertDataFolderExists() {
        if (!fs.existsSync(DATA_FOLDER)) {
            fs.mkdirSync(DATA_FOLDER);
        }
    }
    loadFromFile() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, "utf8");
                this.items = JSON.parse(data);
            }
            else {
                this.items = [];
            }
        }
        catch (error) {
            // If an error occurs while reading the file, assume an empty array
            this.items = [];
        }
    }
    saveToFile() {
        const data = JSON.stringify(this.items, null, 2);
        fs.writeFileSync(this.filePath, data, "utf8");
    }
    add = async (item) => {
        this.items.push(item);
        this.saveToFile();
        return item;
    };
    get = async () => {
        return this.items;
    };
    // only for chatRepository
    getByPagination = async (limit, lastId) => {
        const sortedItems = [...this.items].sort((a, b) => b.id - a.id);
        let returnedItems = [];
        if (lastId === 0) {
            returnedItems = sortedItems.slice(0, limit);
        }
        else {
            returnedItems = sortedItems.filter(item => item.id < lastId).slice(0, limit);
        }
        return returnedItems;
    };
    update = async (item) => {
        const index = this.items.findIndex((existingItem) => {
            return existingItem.id === item.id;
        });
        if (index !== -1) {
            this.items[index] = item;
            this.saveToFile();
            return item;
        }
        throw new Error("Item not found.");
    };
    remove = async (id) => {
        const index = this.items.findIndex((item) => {
            return item.id === id;
        });
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveToFile();
            return true;
        }
        return false;
    };
    removeAll = async () => {
        this.items = []; // clear all items
        this.saveToFile(); // save
    };
}
exports.DiskStorageRepositoryImpl = DiskStorageRepositoryImpl;
