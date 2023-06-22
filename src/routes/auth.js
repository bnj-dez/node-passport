import express from "express";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import LocalStrategy from "passport-local";
import crypto from "node:crypto";
import dotenv from "dotenv";
import { UserModel } from "../models/User.js";
import { error } from "node:console";
import { createHmac } from "node:crypto";
import argon2 from "argon2";

dotenv.config({ path: "../../.env" });

passport.use(
  new LocalStrategy(async function verify(email, password, cb) {
    // db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
    //   if (err) { return cb(err); }
    //   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    //   crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, row);
    //   });
    // });
    console.log("avant user")
    const user = await UserModel.findOne({ email: email });
    console.log("users =====", user )
    if (!user) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    const { SECRET } = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    if (
      hashSha !== userExist?.password["sha-256"] ||
      !(await argon2.verify(userExist?.password.argon2, password))
    ) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    return cb(null, user);
  })
);

// passport.use(new FacebookStrategy({
//     clientID: process.env['FACEBOOK_CLIENT_ID'],
//     clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
//     callbackURL: '/oauth2/redirect/facebook',
//     state: true
// }, function verify(accessToken, refreshToken, profile, cb) {
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
// }));

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

// authRouter.get('/login/federated/facebook', passport.authenticate('facebook'));

// authRouter.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
//     successReturnToOrRedirect: '/test',
//     failureRedirect: '/login'
// }));

authRouter.post(
  "/login/password",
  passport.authenticate("local"),
  (req, res) => {
    res.send("You are authenticated !");
  }
);

export {authRouter};
