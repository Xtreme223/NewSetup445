"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHijriDate = exports.getNewMessageId = void 0;
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
const log = (0, logger_1.default)(__filename);
async function getNewMessageId() {
    const settingRepo = (0, config_1.getSettingRepository)();
    const settings = await settingRepo.get();
    const setting = settings[0];
    setting.autoIncrement = setting.autoIncrement + 1;
    await settingRepo.update(setting);
    return setting.autoIncrement;
}
exports.getNewMessageId = getNewMessageId;
async function getHijriFromAPI() {
    let hijri;
    try {
        let res = await fetch("https://hijri.habibur.com/api01/date/?raw=yes");
        hijri = await res.text();
    }
    catch (error) {
        hijri = "";
    }
    return hijri;
}
const updateHijri = async () => {
    const hijri = await getHijriFromAPI();
    const settingRepo = (0, config_1.getSettingRepository)();
    const settings = await settingRepo.get();
    const setting = settings[0];
    setting.hijri = {
        date: hijri,
        lastUpdate: new Date().toISOString(),
    };
    const updatedSetting = await settingRepo.update(setting);
    log.debug("updated hijri date successfully.");
    return updatedSetting.hijri.date;
};
async function getHijriDate() {
    const settingRepo = (0, config_1.getSettingRepository)();
    const settings = await settingRepo.get();
    const setting = settings[0];
    let hijri = setting.hijri.date;
    if (hijri) {
        const oneHourInMilliseconds = 60 * 60 * 1000;
        const lastUpdate = new Date(setting.hijri.lastUpdate).getTime();
        const currentTime = new Date().getTime();
        if (currentTime - lastUpdate >= oneHourInMilliseconds) {
            hijri = await updateHijri();
        }
    }
    else {
        hijri = await updateHijri();
    }
    return hijri;
}
exports.getHijriDate = getHijriDate;
