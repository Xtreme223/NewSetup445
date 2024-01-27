"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionUser = exports.UserDto = void 0;
const BaseDto_1 = require("./BaseDto");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserDto extends BaseDto_1.BaseDto {
    username;
    password;
    langPref;
    active;
    isAdmin;
    createdDate;
    lastLoginDate;
    isSuperAdmin;
    soundPref = true;
    constructor(json) {
        super(json);
        // Assign values with falsy checks
        this.username = json?.username || "";
        this.password = json?.password || "";
        this.langPref = json?.langPref || "en";
        this.active = json?.active || false;
        this.isAdmin = json?.isAdmin || false;
        this.isSuperAdmin = json.isSuperAdmin || false;
        this.soundPref = json.soundPref === undefined ? true : json.soundPref;
        this.lastLoginDate = json?.lastLoginDate;
        this.createdDate = json?.createdDate;
    }
    isValid() {
        return !!this.username?.trim();
    }
    isValidCredentials() {
        // if username or password is empty or null, then invalid
        return !!this.username?.trim() && !!this.password?.trim();
    }
    getPasswordHash(saltRounds = 10) {
        // if password is empty or null, then return empty string else the hashed password
        return this.password?.trim()
            ? bcrypt_1.default.hashSync(this.password, saltRounds)
            : "";
    }
}
exports.UserDto = UserDto;
/**
 * Represents current loggedin User
 */
class SessionUser {
    id;
    username;
    langPref;
    active;
    isAdmin;
    soundPref;
    constructor(id, username, langPref, active, isAdmin, soundPref) {
        this.id = id;
        this.username = username;
        this.langPref = langPref;
        this.active = active;
        this.isAdmin = isAdmin;
        this.soundPref = soundPref;
    }
}
exports.SessionUser = SessionUser;
