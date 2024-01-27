"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = void 0;
/**
 * Custom Error class to send meaningful response to client from service layer
 * Instead of direct response message, lang value has been used here.
 * Please refer to lang/lang_file for more information.
 */
class ClientError {
    message;
    data;
    constructor(message, data) {
        this.message = message;
        if (data)
            this.data = data;
    }
    static invalidError() {
        return new ClientError("client_error.invalid_error");
    }
    static WrongPassword() {
        return new ClientError("client_error.wrong_password");
    }
    static invalidCredentials() {
        return new ClientError("client_error.invalid_credentials");
    }
    static inactiveUser() {
        return new ClientError("client_error.inactive_user");
    }
    static duplicateError() {
        return new ClientError("client_error.duplicate_error");
    }
    static notExistsError() {
        return new ClientError("client_error.not_exists_error");
    }
    static accessDeniedError() {
        return new ClientError("client_error.access_denied");
    }
    static connectionFailedError() {
        return new ClientError("client_error.connection_failed_error");
    }
    static passwordsNotIdenticalError() {
        return new ClientError("client_error.passwords_not_identical_error");
    }
}
exports.ClientError = ClientError;
