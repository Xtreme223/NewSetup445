import { BaseDto } from "./BaseDto";
declare class SettingDto extends BaseDto {
    notice: string;
    chatState: boolean;
    constructor(json?: any);
}
export { SettingDto };
