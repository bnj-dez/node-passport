import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import passport from "passport";
import cors from "cors";
import router from "./routes/routes.js"
import { config } from "dotenv";
import MongoStore from 'connect-mongo';

import("../db.js");

const app = express();
const port = 3000;
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl:"mongodb+srv://" + process.env.DB_USER + "@form.ghmv5pa.mongodb.net/Passport" }),
  })
);

app.use(passport.authenticate("session"));

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

app.use("/", router ); 

app.listen(port, () => {
  console.log("Serveur en écoute sur le port " + port);
});
