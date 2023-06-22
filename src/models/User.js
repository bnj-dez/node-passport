import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: String,
  username: String,
  email:  String,
  phone:  String ,
  fb_token: String,
  password: {
    sha256: String,
    argon2: String
  },
});

export const UserModel = model("user", UserSchema);
