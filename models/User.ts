import { BaseModel } from "./BaseModel";

class User extends BaseModel {
  username: string;
  password: string;
  active: boolean;
  langPref: string;
  isAdmin: boolean;
  createdDate: Date;
  lastLoginDate: string | undefined;
  isSuperAdmin: boolean;
  soundPref = true;

  constructor(json: any = {}) {
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

export { User };
