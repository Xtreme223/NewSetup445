import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from "express";
import path from "path";
import session from "express-session";
import authRouter from "./routes/auth";
import router from "./routes/router";

require("./config/logger");

// initialize storage repository and insert dummy admin user( with super admin role)
require("./config/initData");

const app = express();

const sessionMiddleware = session({
  // It holds the secret key for session
  secret: "My_T00P-Secr@t",
  // Forces the session to be saved to the session store
  resave: true,
  // Forces a session that is "uninitialized" to be saved to the store
  saveUninitialized: true,
  // cookie
  cookie: { maxAge: 10 * (1000 * 60 * 60) }, // three hour in mili-seconds.
});

// Session Setup
app.use(sessionMiddleware);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static("public"));

const publicFolder =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../frontend/build")
    : path.join(__dirname, "../../build");

// serve react static contents
app.use(express.static(publicFolder));
// serve index.html for all URL requests
app.get("/react-server", (req, res) => {
  res.sendFile(path.join(publicFolder, "/index.html"));
});
// ***************** List of routes starts ***********************

// Mount auth router at /auth
app.use("/auth", authRouter);

// Mount API router at /api
app.use("/api", router);

export { app, sessionMiddleware };
