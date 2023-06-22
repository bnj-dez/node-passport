import mongoose from "mongoose";
import dotenv from "dotenv";
// ==========
// Connexion à mongoose
// =========
dotenv.config({ path: "./.env" });

mongoose
  .connect(
    "mongodb+srv://" + process.env.DB_USER + "@form.ghmv5pa.mongodb.net/Passport"
  )
  .then(() => console.log("Connected to MongoDB"));
