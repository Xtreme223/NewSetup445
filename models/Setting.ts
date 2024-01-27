import { BaseModel } from "./BaseModel";

type Hijri = {
  date: string;
  lastUpdate: string;
}

class Setting extends BaseModel {
  notice: string;
  chatState: boolean;
  autoIncrement: number;
  hijri: Hijri;

  constructor(json: any = {}) {
    super(json);
    this.notice = json.notice || "";
    this.chatState = json.chatState || true; // by default  chat should be enabled
    this.autoIncrement = 1;
    this.hijri = {
      date: "",
      lastUpdate: ""
    };
  }
}

export { Setting };
