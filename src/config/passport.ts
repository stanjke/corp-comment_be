import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { secretOrKey } from "./keys";
import { IUser, User } from "../models/User";
import { PassportStatic } from "passport";

export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey as string,
      },
      (payload, done) => {
        User.findById(payload.id)
          .then((user) => {
            if (user) {
              return done(null, user);
            }

            return done(null, false);
          })
          .catch((err) => done(err, false));
      }
    )
  );
};
