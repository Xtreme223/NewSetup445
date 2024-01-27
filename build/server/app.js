"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = exports.app = void 0;
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = __importDefault(require("./routes/auth"));
const router_1 = __importDefault(require("./routes/router"));
require("./config/logger");
// initialize storage repository and insert dummy admin user( with super admin role)
require("./config/initData");
const app = (0, express_1.default)();
exports.app = app;
const sessionMiddleware = (0, express_session_1.default)({
    // It holds the secret key for session
    secret: "My_T00P-Secr@t",
    // Forces the session to be saved to the session store
    resave: true,
    // Forces a session that is "uninitialized" to be saved to the store
    saveUninitialized: true,
    // cookie
    cookie: { maxAge: 10 * (1000 * 60 * 60) }, // three hour in mili-seconds.
});
exports.sessionMiddleware = sessionMiddleware;
// Session Setup
app.use(sessionMiddleware);
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Serve static files from the "public" directory
app.use(express_1.default.static("public"));
const publicFolder = process.env.NODE_ENV === "development"
    ? path_1.default.join(__dirname, "../frontend/build")
    : path_1.default.join(__dirname, "../../build");
// serve react static contents
app.use(express_1.default.static(publicFolder));
// serve index.html for all URL requests
app.get("/react-server", (req, res) => {
    res.sendFile(path_1.default.join(publicFolder, "/index.html"));
});
// ***************** List of routes starts ***********************
// Mount auth router at /auth
app.use("/auth", auth_1.default);
// Mount API router at /api
app.use("/api", router_1.default);
