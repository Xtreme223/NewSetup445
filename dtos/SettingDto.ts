import { BaseDto } from "./BaseDto";

class SettingDto extends BaseDto {
  notice: string;
  chatState: boolean;

  constructor(json: any = {}) {
    super(json);
    this.notice = json.notice || "";
    this.chatState = json.chatState || false; // by default  chat should be enabled
  }
}

export { SettingDto };
