import { UserModel } from "../models/User.js";

export default async function (req, res) {
  try {
    // const {username, email, phone, password} = req.body;
    const user = new UserModel({ ...req.body });
    await user.save();
    res.status(201).send({
      isRegistered: true,
    });
  } catch (error) {
    res.status(400).json({ isRegistered: false, error: error.message });
  }
}
