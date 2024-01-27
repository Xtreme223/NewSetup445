/**
 * Custom Error class to send meaningful response to client from service layer
 * Instead of direct response message, lang value has been used here.
 * Please refer to lang/lang_file for more information.
 */
declare class ClientError {
    message: string;
    data: any;
    constructor(message: string, data?: any);
    static invalidError(): ClientError;
    static WrongPassword(): ClientError;
    static invalidCredentials(): ClientError;
    static inactiveUser(): ClientError;
    static duplicateError(): ClientError;
    static notExistsError(): ClientError;
    static accessDeniedError(): ClientError;
    static connectionFailedError(): ClientError;
    static passwordsNotIdenticalError(): ClientError;
}
export { ClientError };
