"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const BaseModel_1 = require("./BaseModel");
class ReplyTo {
    username;
    text;
    constructor(json = {}) {
        this.text = json.text || "";
        this.username = json.username || "";
    }
}
class Message extends BaseModel_1.BaseModel {
    text;
    username;
    sender;
    time;
    replyTo;
    edited_at;
    reactions;
    constructor(json = {}) {
        super(json);
        this.text = json.text || "";
        this.username = json.username || "";
        this.sender = json.sender || "";
        this.time = json.time || "";
        this.replyTo = new ReplyTo(json.replyTo) || null;
        this.reactions = json.reactions || {};
    }
}
exports.Message = Message;
