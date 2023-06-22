import express from "express";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
import { UserModel } from "../models/User.js";
import { createHmac } from "node:crypto";
import argon2 from "argon2";
import { FederatedCredentialModel } from "../models/FederetedCredential.js";

dotenv.config();

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await UserModel.findOne({ email: username });
    if (!user) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    const { SECRET } = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");

    if (
      hashSha !== user?.password.sha256 ||
      !(await argon2.verify(user?.password.argon2, password))
    ) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    return cb(null, user);
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/login/oauth2/redirect/facebook",
      profileFields: ["emails", "displayName"],
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      // const email = profile.emails[0].value;
      try {
        const userExist = UserModel.findOne({ fb_token: profile.id });

        if (!userExist) {
          // const userExist = await UserModel.findOne({ email: profile.emails[0].value });
          // if(userExist) return cb('Cet email est déja utilisé pour un compte, veuillez tenter de vous connecté');

          const userToAdd = new UserModel({
            username: profile.displayName,
            email: profile.emails[0].value,
            fb_token: profile.id,
          });
          await userToAdd.save();

          return cb(null, userToAdd);
        }

        return cb(null, userExist);
      } catch (error) {
        return cb(error.message)
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { ...user });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const authRouter = express.Router();
authRouter.use(passport.session());

authRouter.get(
  "/federated/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

authRouter.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successReturnToOrRedirect: "/test",
    failureRedirect: "/login",
  })
);

authRouter.post("/password", passport.authenticate("local"), (req, res) => {
  res.send("You are authenticated !");
});

export { authRouter };
