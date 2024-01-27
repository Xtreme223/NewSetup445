"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingDto = void 0;
const BaseDto_1 = require("./BaseDto");
class SettingDto extends BaseDto_1.BaseDto {
    notice;
    chatState;
    constructor(json = {}) {
        super(json);
        this.notice = json.notice || "";
        this.chatState = json.chatState || false; // by default  chat should be enabled
    }
}
exports.SettingDto = SettingDto;
