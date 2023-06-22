import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: String,
  username: String,
  email: String,
  phone: String,
  password: {
    sha256: String,
    argon2: String
  },
});

export const UserModel = model("user", UserSchema);
