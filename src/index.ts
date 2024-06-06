import express from "express";
import mongoose from "mongoose";
import user from "./routes/UserRouter";
import comment from "./routes/CommentRouter";
import bodyParser from "body-parser";
import { mongoURI } from "./config/keys";
import passport from "passport";
import passportJwtStrategy from "./config/passport";
import cors from "cors";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors());

mongoose
  .connect(mongoURI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// app.use(session({ secret: mongoURI as string, resave: false, saveUninitialized: true }));
app.use(passport.initialize());

passportJwtStrategy(passport);

app.use("/api/user", user);
app.use("/api/comment", comment);

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
