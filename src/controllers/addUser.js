import { UserModel } from "../models/User.js";
import { createHmac } from "node:crypto";

export default async function (req, res) {
  try {
    const { password } = req.body;
    const { SECRET } = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    const user = new UserModel({ ...req.body, password: hashSha });
    await user.save();
    res.status(201).send({
      isRegistered: true,
    });
  } catch (error) {
    res.status(400).json({ isRegistered: false, error: error.message });
  }
}
