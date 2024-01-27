"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
    id = "";
    constructor(data) {
        if (!data)
            return;
        this.id = data.id;
    }
}
exports.BaseModel = BaseModel;
