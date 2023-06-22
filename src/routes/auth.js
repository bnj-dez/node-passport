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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/login/oauth2/redirect/facebook',
    state: true
}, async function verify(accessToken, refreshToken, profile, cb) {
  console.log('test');
//     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
//     'https://www.facebook.com',
//     profile.id
//     ], function(err, row) {
//         if (err) { return cb(err); }

//         if (!row) {
//             db.run('INSERT INTO users (name) VALUES (?)', [
//             profile.displayName
//             ], function(err) {
//             if (err) { return cb(err); }

//             var id = this.lastID;
//             db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
//                 id,
//                 'https://www.facebook.com',
//                 profile.id
//             ], function(err) {
//                 if (err) { return cb(err); }
//                 var user = {
//                 id: id,
//                 name: profile.displayName
//                 };
//                 return cb(null, user);
//             });
//         });
//     } else {
//         db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
//         if (err) { return cb(err); }
//         if (!row) { return cb(null, false); }
//         return cb(null, row);
//         });
//     }
//     });
  const federatedCredential = await FederatedCredentialModel.findOne({ provider: 'https://www.facebook.com', subject: profile.id });

  // if (!row) {
  //   db.run('INSERT INTO users (name) VALUES (?)', [
  //   profile.displayName
  //   ], function(err) {
  //   if (err) { return cb(err); }

  //   var id = this.lastID;
  //   db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
  //       id,
  //       'https://www.facebook.com',
  //       profile.id
  //   ], function(err) {
  //       if (err) { return cb(err); }
  //       var user = {
  //       id: id,
  //       name: profile.displayName
  //       };
  //       return cb(null, user);
  //   });
  // });
  // }
  // return cb(null, user);

}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const authRouter = express.Router();

authRouter.get('/federated/facebook', passport.authenticate('facebook'));

authRouter.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successReturnToOrRedirect: '/test',
    failureRedirect: '/login'
}));

authRouter.post(
  "/password",
  passport.authenticate("local"),
  (req, res) => {
    res.send("You are authenticated !");
  }
);

export {authRouter};
