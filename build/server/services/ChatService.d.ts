import { Response } from "express";
declare const downloadJson: (res: Response) => Promise<void>;
declare const downloadAll: () => Promise<any>;
declare const deleteAllChat: (res: Response) => Promise<void>;
export { downloadJson, downloadAll, deleteAllChat };
