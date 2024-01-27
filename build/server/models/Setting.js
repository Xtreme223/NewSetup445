"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const BaseModel_1 = require("./BaseModel");
class Setting extends BaseModel_1.BaseModel {
    notice;
    chatState;
    autoIncrement;
    hijri;
    constructor(json = {}) {
        super(json);
        this.notice = json.notice || "";
        this.chatState = json.chatState || true; // by default  chat should be enabled
        this.autoIncrement = 1;
        this.hijri = {
            date: "",
            lastUpdate: ""
        };
    }
}
exports.Setting = Setting;
