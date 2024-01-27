import { BaseModel } from "./BaseModel";
declare class User extends BaseModel {
    username: string;
    password: string;
    active: boolean;
    langPref: string;
    isAdmin: boolean;
    createdDate: Date;
    lastLoginDate: string | undefined;
    isSuperAdmin: boolean;
    soundPref: boolean;
    constructor(json?: any);
}
export { User };
