/***Imports */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";

const app = express();

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/recapApp")
  .then(() => console.log("connected to dB"))
  .catch((err) => {
    console.error(err);
  });

/*****Middlewares*****/
app.use(express.json());
app.use(cors);
app.use(logger("combined"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

/*******  Module Imports  ******/
import Note from "./models/note.js";
import User from "./models/user.js";
import Collection from "./models/collection.js";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/****   Routes **** */

//register
app.post("/register", (req, res) => {
  const newUser = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        authenticated: false,
      });
    }
    passport.authenticate("local")(req, res, () => {
      res.status(201).json({
        success: true,
        message: "Registration successful",
        user: req.user,
        authenticated: true,
      });
    });
  });
});

//Login
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  res
    .status(200)
    .json({ message: "Login successful", user: req.user, authenticated: true });
});

/**** get user*/
// get user
app.get(
  "/user",
  /*ensureAuthenticated,*/ (req, res) => {
    console.log(req.user);
    const userInfo = req.user;
    res.json(userInfo);
  }
);

/*
const pingMessage = {
  message: "HI",
};

app.post("/ping", async (req, res) => {
  await (pingMessage.message = req.body.message);
  res.json();
});

/*
//returns the notes
app.get("/notes", async (req, res) => {
  const response = await Note.find();
  res.json(response);
});

//saves a new note
app.post("/add", async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const note = new Note({
    title: title,
    content: content,
  });

  await note.save().then(() => {
    console.log("new note saved");
  });
});

//deletes a note
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndRemove(id).then(() => {
    console.log("item deleted");
  });
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const editedNote = await Note.findById({ _id: id });
  res.json(editedNote);
});

app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  await Note.findByIdAndUpdate({ _id: id }, { title: title, content: content });
  res.json({ message: "Note updated" });
});

app.get("/view/:id", async (req, res) => {
  const id = req.params.id;
  const response = await Note.findById({ _id: id });
  res.json(response);
});

//Update favourite note

app.get("/favourites", async (req, res) => {
  const response = await Note.find({ favourited: true });
  res.json(response);
});

app.put("/toggleFavourites/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const note = await Note.findByIdAndUpdate({ _id: id });

    if (note.favourited) {
      note.favourited = false;
      await note.save();
    } else {
      note.favourited = true;
      await note.save();
    }
    console.log("Update Done on favourites!");
  } catch (error) {
    console.error("Error" + error.message);
  }
});*/

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: "User is not authenticated" });
}

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
