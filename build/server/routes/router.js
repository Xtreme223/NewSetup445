"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const SettingController_1 = require("../controllers/SettingController");
const UserController_1 = require("../controllers/UserController");
const ChatController_1 = require("../controllers/ChatController");
const router = express_1.default.Router();
/* router level middleware
 * all routes starting with /api must be loggedin
 */
router.use((req, res, next) => {
    if (req.session?.userInfo?.username)
        next();
    else
        res.status(401).json({ message: "You were logged out, Log in please" });
});
router.post("/changePassword", UserController_1.changePassword);
router.post("/soundPref", UserController_1.updateSoundPref);
router.post("/langPref", UserController_1.updateLangPref);
/* Users Route */
router.get("/users", UserController_1.getUsers);
router.post("/users", UserController_1.addUser);
router.get("/users/me", UserController_1.getLoggedInUserInfo);
router.delete("/users/:id", UserController_1.removeUser);
router.put("/users/:id/make-admin", UserController_1.makeUserAdmin);
router.put("/users/:id/make-user", UserController_1.makeUserRegular);
router.put("/users/:id/suspend", UserController_1.suspendUser);
router.put("/users/:id/approve", UserController_1.unsuspendUser);
router.get("/chat/getNotice", SettingController_1.getNotice);
router.post("/chat/getMessages", ChatController_1.getMessages);
router.put("/chat/updateNotice", SettingController_1.updateNotice);
router.get("/chat/download-json", SettingController_1.downloadChat);
router.get("/chat/download", SettingController_1.downloadFormatted);
router.put("/chat/enable", SettingController_1.enableChat);
router.put("/chat/disable", SettingController_1.disableChat);
router.get("/chat/canChat", SettingController_1.canWeChat);
router.delete("/chat/delete", SettingController_1.deleteChat);
router.get("/hijri", SettingController_1.getHijri);
module.exports = router;
