export const bcryptSalt = 10;

export enum AppRoute {
  USER = "/api/user",
  COMMENT = "/api/comment",
}

export enum UserRoute {
  REGISTER = "/register",
  LOGIN = "/login",
  UPDATE_PASSWORD = "/password",
  GET_USER = "/user",
}
