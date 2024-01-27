/// <reference types="qs" />
import express from "express";
declare const app: import("express-serve-static-core").Express;
declare const sessionMiddleware: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export { app, sessionMiddleware };
