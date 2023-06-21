import express from "express";
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import LocalStrategy from 'passport-local';
import crypto from 'node:crypto';
import { db } from '../db.js';
import dotenv from "dotenv";

dotenv.config();

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
      if (err) { return cb(err); }
      if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, row);
      });
    });
  }));



passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/facebook',
    state: true
}, function verify(accessToken, refreshToken, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    'https://www.facebook.com',
    profile.id
    ], function(err, row) {
        if (err) { return cb(err); }

        if (!row) {
            db.run('INSERT INTO users (name) VALUES (?)', [
            profile.displayName
            ], function(err) {
            if (err) { return cb(err); }

            var id = this.lastID;
            db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
                id,
                'https://www.facebook.com',
                profile.id
            ], function(err) {
                if (err) { return cb(err); }
                var user = {
                id: id,
                name: profile.displayName
                };
                return cb(null, user);
            });
        });
    } else {
        db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
        });
    }
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
});
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

const authRouter = express.Router();

authRouter.get('/login/federated/facebook', passport.authenticate('facebook'));

authRouter.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successReturnToOrRedirect: '/test',
    failureRedirect: '/login'
}));

authRouter.post('/login/password', passport.authenticate('local'),(req,res)=>{
    res.send('You are authenticated !')
  });


    
export {authRouter};