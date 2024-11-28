const endpoints = {
  get_auth: "/auth",
  put_setPassword: "/auth/set-password",
  post_login: "/auth/login",
  post_PasswordReset: "/auth/password/reset",
  put_PasswordReset: "/auth/password/reset",
  get_PasswordReset: (token: string) => `/auth/password/reset/${token}`,
  post_send_2fa: "/auth/send-2fa",
  post_enable_2fa: "/auth/enable-2fa",
  post_disable_2fa: "/auth/disable-2fa",
  post_verify_2fa_token: "/auth/verify-2fa-token",
  post_verify_login_2fa: "/auth/verify-login-2fa",
  put_user: "/user",
  post_logout: "/auth/logout",
  post_userUpload: "/user/upload",
  put_userPassword: "/user/password",
  
};

export default endpoints;
