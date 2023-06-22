import express from "express";
// import { authRouter } from "../routes/auth.js";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import passport from "passport";
import cors from "cors";

import("../db.js");

const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Ok");
});

// app.use("/",); //authRouter

app.listen(port, () => {
  console.log("Serveur en écoute sur le port " + port);
});
