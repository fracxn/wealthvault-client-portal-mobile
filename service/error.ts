

type ErrorType =
  | "auth"
  | "get_invite"
  | "post_invite"
  | "accept_invite"
  | "set_password"
  | "login"
  | "reset_password_email"
  | "reset_password_reset"
  | "reset_password_confirm"
  | "generate_2fa_token"
  | "verify_2fa_token"
  | "update_profile"
  | "logout"
  | "user_upload"
  | "user_password"
  | "zoho_credentials"
  | "zoho_articles"
  | "zoho_kb"
  | "post_enable_2fa"
  | "post_disable_2fa"
  | "post_send_2fa"
  | "get_documents"
  | "IB"
  | "post_createIbAccount";

const loginTypes = [
  "auth",
  "get_invite",
  "post_invite",
  "set_password",
  "login",
  "reset_password_email",
  "reset_password_reset",
  "reset_password_confirm",
  "generate_2fa_token",
  "verify_2fa_token",
  "accept_invite",
  "post_send_2fa",
];

const errorCode = {
  sessionTimeout: 440,
  unauthorized: 401,
};


export const handleError = (error: any, type: ErrorType) => {
  const errMsg = error?.response?.data?.message;
  const errCode = error?.response?.status;

  
};
