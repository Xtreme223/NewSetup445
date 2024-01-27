import { Request, Response } from "express";
import { UserDto } from "../dtos/UserDto";
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const logout: (req: Request, res: Response) => Promise<any>;
declare const setSession: (req: Request, user: UserDto) => Promise<void>;
export { login, logout, setSession };
