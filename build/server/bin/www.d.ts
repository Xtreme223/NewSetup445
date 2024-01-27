#!/usr/bin/env node
/**
 * Module dependencies.
 */
import { Session } from "express-session";
import { SessionUser } from "../dtos/UserDto";
/** Now socket io configurations starts. Please refere to the link for more details.
https://socket.io/how-to/use-with-express-session **/
declare module "http" {
    interface IncomingMessage {
        session: Session & {
            userInfo: SessionUser;
            authenticated: boolean;
        };
    }
}
/**
 * Handling logout
 * https://socket.io/how-to/use-with-express-session
 * @param sessionId
 */
declare const destroySocketSession: (sessionId: any) => void;
export { destroySocketSession };
