"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const BaseModel_1 = require("./BaseModel");
class User extends BaseModel_1.BaseModel {
    username;
    password;
    active;
    langPref;
    isAdmin;
    createdDate;
    lastLoginDate;
    isSuperAdmin;
    soundPref = true;
    constructor(json = {}) {
        super(json);
        this.username = json.username || "";
        this.password = json.password || "";
        this.active = json.active ?? false;
        this.langPref = json.langPref || "en";
        this.isAdmin = json.isAdmin || false;
        this.isSuperAdmin = json.isSuperAdmin || false;
        this.soundPref = json.sound_pref;
        // Initialize createdDate from server (current date and time)
        this.createdDate = new Date();
        this.lastLoginDate = undefined;
    }
}
exports.User = User;
