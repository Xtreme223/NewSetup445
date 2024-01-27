import { BaseDto } from "./BaseDto";
import bcrypt from "bcrypt";

class UserDto extends BaseDto {
  username: string;
  password: string;
  langPref: string;
  active: boolean;
  isAdmin: boolean;
  createdDate: Date | undefined;
  lastLoginDate: string | undefined;
  isSuperAdmin: boolean;
  soundPref = true;

  constructor(json: any) {
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
      ? bcrypt.hashSync(this.password, saltRounds)
      : "";
  }
}

/**
 * Represents current loggedin User
 */
class SessionUser {
  id: string;
  username: string;
  langPref: string;
  active: boolean;
  isAdmin: boolean;
  soundPref: boolean;

  constructor(
    id: string,
    username: string,
    langPref: string,
    active: boolean,
    isAdmin: boolean,
    soundPref: boolean
  ) {
    this.id = id;
    this.username = username;
    this.langPref = langPref;
    this.active = active;
    this.isAdmin = isAdmin;
    this.soundPref = soundPref;
  }
}

export { UserDto, SessionUser };
