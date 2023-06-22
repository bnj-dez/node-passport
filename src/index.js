import express from "express";
import { authRouter } from "../routes/auth.js";
import logger from "morgan";
import session from "express-session";
import SQLiteStoreModule from "connect-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";
import passport from "passport";
import cors from "cors";
import("../db.js");

// const SQLiteStore = SQLiteStoreModule(session);
const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);

app.use(passport.authenticate("session"));

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/test", (req, res) => {
  res.send("Ok");
});

app.use("/", authRouter);

app.listen(port, () => {
  console.log("Serveur en écoute sur le port " + port);
});
