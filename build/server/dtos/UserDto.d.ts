import { BaseDto } from "./BaseDto";
declare class UserDto extends BaseDto {
    username: string;
    password: string;
    langPref: string;
    active: boolean;
    isAdmin: boolean;
    createdDate: Date | undefined;
    lastLoginDate: string | undefined;
    isSuperAdmin: boolean;
    soundPref: boolean;
    constructor(json: any);
    isValid(): boolean;
    isValidCredentials(): boolean;
    getPasswordHash(saltRounds?: number): string;
}
/**
 * Represents current loggedin User
 */
declare class SessionUser {
    id: string;
    username: string;
    langPref: string;
    active: boolean;
    isAdmin: boolean;
    soundPref: boolean;
    constructor(id: string, username: string, langPref: string, active: boolean, isAdmin: boolean, soundPref: boolean);
}
export { UserDto, SessionUser };
