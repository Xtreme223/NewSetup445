import { UserDto } from "../dtos/UserDto";
declare const login: (user: UserDto) => Promise<UserDto>;
export { login };
