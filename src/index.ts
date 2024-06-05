import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/auth";
import user from "./routes/user";
import bodyParser from "body-parser";
import { mongoURI } from "./config/keys";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(mongoURI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(session({ secret: mongoURI as string, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", user);

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
