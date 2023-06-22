import { UserModel } from "../models/User.js";
import { createHmac } from "node:crypto";
import argon2 from 'argon2';

export default async function (req, res) {
  try {
    const { password } = req.body;
    const { SECRET } = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    let hashArgon = await argon2.hash(password);

    const userExist = await UserModel.findOne({ email: req.body.email });
    if(userExist) return res.status(400).json({ isRegistered: false, error: 'Cet email est déja utilisé pour un compte, veuillez tenter de vous connecté' });

    const user = new UserModel({ ...req.body, password: {
      sha256: hashSha,
      argon2: hashArgon
    } });
    await user.save();
    res.status(201).send({
      isRegistered: true,
    });
  } catch (error) {
    res.status(400).json({ isRegistered: false, error: error.message });
  }
}
