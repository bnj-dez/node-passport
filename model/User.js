import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: String,
  username: String,
  email: String,
  phone: Number,
  password: String,
});

export const UserModel = model("user", UserSchema);
