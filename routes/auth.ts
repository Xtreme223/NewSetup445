import express, {  } from "express";
import * as authController from "../controllers/AuthController";
import * as userController from "../controllers/UserController";

const router = express.Router();

router.post("/register", userController.addUser);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

export = router;
