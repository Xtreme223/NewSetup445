import { BaseModel } from "./BaseModel";
type Hijri = {
    date: string;
    lastUpdate: string;
};
declare class Setting extends BaseModel {
    notice: string;
    chatState: boolean;
    autoIncrement: number;
    hijri: Hijri;
    constructor(json?: any);
}
export { Setting };
