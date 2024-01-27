import express, { Request, Response } from "express";
import {
  canWeChat,
  deleteChat,
  disableChat,
  downloadChat,
  enableChat,
  updateNotice,
  getNotice,
  getHijri,
  downloadFormatted,
} from "../controllers/SettingController";
import {
  getUsers,
  addUser,
  removeUser,
  makeUserAdmin,
  makeUserRegular,
  suspendUser,
  unsuspendUser,
  changePassword,
  updateSoundPref,
  getLoggedInUserInfo,
  updateLangPref,
} from "../controllers/UserController";
import { getMessages } from "../controllers/ChatController"
const router = express.Router();

/* router level middleware
 * all routes starting with /api must be loggedin
 */
router.use((req, res, next) => {
  if (req.session?.userInfo?.username) next();
  else
    res.status(401).json({ message: "You were logged out, Log in please" });
});


router.post("/changePassword", changePassword);

router.post("/soundPref", updateSoundPref);

router.post("/langPref", updateLangPref);

/* Users Route */
router.get("/users", getUsers);

router.post("/users", addUser);

router.get("/users/me", getLoggedInUserInfo);

router.delete("/users/:id", removeUser);

router.put("/users/:id/make-admin", makeUserAdmin);

router.put("/users/:id/make-user", makeUserRegular);

router.put("/users/:id/suspend", suspendUser);

router.put("/users/:id/approve", unsuspendUser);

router.get("/chat/getNotice", getNotice);

router.post("/chat/getMessages", getMessages);

router.put("/chat/updateNotice", updateNotice);

router.get("/chat/download-json", downloadChat);

router.get("/chat/download", downloadFormatted);

router.put("/chat/enable", enableChat);

router.put("/chat/disable", disableChat);

router.get("/chat/canChat", canWeChat);

router.delete("/chat/delete", deleteChat);

router.get("/hijri", getHijri);

export = router;
