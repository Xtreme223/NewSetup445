import { BaseModel } from "./BaseModel";
declare class ReplyTo {
    username: string;
    text: string;
    constructor(json?: any);
}
declare class Message extends BaseModel {
    text: string;
    username: string;
    sender: string;
    time: string;
    replyTo: ReplyTo;
    edited_at?: string;
    reactions: any;
    constructor(json?: any);
}
export { Message };
