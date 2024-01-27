import { getSettingRepository } from "../config/config";
import logger from "../config/logger";
import { Setting } from "../models/Setting";

const log = logger(__filename);

async function getNewMessageId() {
    const settingRepo = getSettingRepository()
    const settings: Setting[] = await settingRepo.get();
    const setting: Setting = settings[0];

    setting.autoIncrement = setting.autoIncrement + 1;
    await settingRepo.update(setting)

    return setting.autoIncrement;
}

async function getHijriFromAPI() {
    let hijri
    try {
        let res = await fetch("https://hijri.habibur.com/api01/date/?raw=yes")
        hijri = await res.text()
    } catch (error) {
        hijri = ""
    }
    return hijri
}

const updateHijri = async () => {
    const hijri = await getHijriFromAPI()
    const settingRepo = getSettingRepository()
    const settings: Setting[] = await settingRepo.get();
    const setting: Setting = settings[0];
    setting.hijri = {
        date: hijri,
        lastUpdate: new Date().toISOString(),
    }
    const updatedSetting = await settingRepo.update(setting)
    log.debug("updated hijri date successfully.");
    return updatedSetting.hijri.date
}

async function getHijriDate() {
    const settingRepo = getSettingRepository()
    const settings: Setting[] = await settingRepo.get();
    const setting: Setting = settings[0];
    let hijri = setting.hijri.date

    if (hijri) {
        const oneHourInMilliseconds = 60 * 60 * 1000;
        const lastUpdate = new Date(setting.hijri.lastUpdate).getTime();
        const currentTime = new Date().getTime();

        if (currentTime - lastUpdate >= oneHourInMilliseconds) {
            hijri = await updateHijri()
        }
    } else {
        hijri = await updateHijri()
    }
    return hijri
}

export {
    getNewMessageId,
    getHijriDate,
}