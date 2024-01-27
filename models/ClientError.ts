/**
 * Custom Error class to send meaningful response to client from service layer
 * Instead of direct response message, lang value has been used here.
 * Please refer to lang/lang_file for more information.
 */
class ClientError {
  message: string;
  data: any;

  constructor(message: string, data?: any) {
    this.message = message;
    if (data) this.data = data;
  }

  static invalidError(): ClientError {
    return new ClientError("client_error.invalid_error");
  }

  static WrongPassword(): ClientError {
    return new ClientError("client_error.wrong_password");
  }

  static invalidCredentials(): ClientError {
    return new ClientError("client_error.invalid_credentials");
  }

  static inactiveUser(): ClientError {
    return new ClientError("client_error.inactive_user");
  }

  static duplicateError(): ClientError {
    return new ClientError("client_error.duplicate_error");
  }

  static notExistsError(): ClientError {
    return new ClientError("client_error.not_exists_error");
  }

  static accessDeniedError(): ClientError {
    return new ClientError("client_error.access_denied");
  }

  static connectionFailedError(): ClientError {
    return new ClientError("client_error.connection_failed_error");
  }

  static passwordsNotIdenticalError(): ClientError {
    return new ClientError("client_error.passwords_not_identical_error");
  }
}

export { ClientError };
