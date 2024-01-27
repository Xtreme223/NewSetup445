import { BaseModel } from "./BaseModel";

class ReplyTo {
  username: string;
  text: string;
  constructor(json: any = {}) {
    this.text = json.text || "";
    this.username = json.username || "";
  }
}

class Message extends BaseModel {
  text: string;
  username: string;
  sender: string;
  time: string;
  replyTo: ReplyTo;
  edited_at?: string;
  reactions: any;

  constructor(json: any = {}) {
    super(json);
    this.text = json.text || "";
    this.username = json.username || "";
    this.sender = json.sender || "";
    this.time = json.time || "";
    this.replyTo = new ReplyTo(json.replyTo) || null;
    this.reactions = json.reactions || {};
  }
}

export { Message };
