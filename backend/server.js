/***Imports */
import dotenv from "dotenv";
dotenv.config();
import { ObjectId } from "mongodb";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import sessionFileStore from "session-file-store";
import logger from "morgan";
import cors from "cors";

const FileStore = sessionFileStore(session);

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
const options = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
  credentials: true,
};
app.use(cors(options));
app.use(logger("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
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

//Auth Middlewares
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: "User is not authenticated" });
}

function validateObjectId(id) {
  if (ObjectId.isValid(id)) {
    return true;
  } else {
    return false;
  }
}

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
  res.status(200).json({
    message: "Login successful",
    user: req.user,
    authenticated: true,
  });
});

//logout
app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out succesfully" });
  });
});
/**** get user*/
// get user
app.get("/user/:id", ensureAuthenticated, async (req, res) => {
  const id = new ObjectId(req.params.id);

  if (validateObjectId(id)) {
    const response = await User.findOne({ _id: id });
    res.json(response);
  } else {
    console.log("Invalid Id String");
  }
});

//returns the notes
app.get("/notes/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);

  if (validateObjectId(uid)) {
    await Note.find({ user: uid })
      .then((foundNotes) => {
        if (foundNotes) {
          res.json(foundNotes);
        } else if (!foundNotes) {
          res.json({ message: "No notes found" });
        }
      })
      .catch((err) => console.error(err));
  } else {
    console.log("Invalid Id String");
  }
});

//creates a new note
app.post("/addnotes", ensureAuthenticated, async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const user = req.body.userID;

  const note = new Note({
    title: title,
    content: content,
    user: user,
  });

  await note.save().then(() => {
    console.log("new note saved");
  });
});

//deletes a note
app.delete("/delete/:nid/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (validateObjectId(uid) && validateObjectId(nid)) {
    await Note.findOneAndRemove({ _id: nid, user: uid }).then((deletedNote) => {
      if (deletedNote) {
        console.log("item deleted");
      } else {
        console.log("No note found or deleted");
      }
    });
  } else {
    console.log("Invalid Id String");
  }
});

//Edit a note
app.get("/edit/:nid/:uid", ensureAuthenticated, async (req, res) => {
  const nid = new ObjectId(req.params.nid);
  const uid = new ObjectId(req.params.uid);

  if (validateObjectId(uid) && validateObjectId(nid)) {
    const editedNote = await Note.findOne({ _id: nid, user: uid });
    res.json(editedNote);
  } else {
    console.log("Invalid Id String");
  }
});

app.put("/edit/:nid/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);
  const title = req.body.title;
  const content = req.body.content;

  if (validateObjectId(uid) && validateObjectId(nid)) {
    await Note.findOneAndUpdate(
      { _id: nid, user: uid },
      { title: title, content: content }
    );
    res.json({ message: "Note updated" });
  } else {
    console.log("Invalid Id String");
  }
});

app.get("/view/:nid/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (validateObjectId(uid) && validateObjectId(nid)) {
    const response = await Note.findOne({ _id: nid, user: uid });
    res.json(response);
  } else {
    console.log("Invalid Id String");
  }
});

//get favourite notes

app.get("/favourites/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  if (validateObjectId(uid)) {
    const response = await Note.find({ user: uid, favourited: true });
    res.json(response);
  } else {
    console.log("Invalid Id String");
  }
});

//update favourite notes
app.put(
  "/toggleFavourites/:nid/:uid",
  ensureAuthenticated,
  async (req, res) => {
    const uid = new ObjectId(req.params.uid);
    const nid = new ObjectId(req.params.nid);

    if (validateObjectId(uid) && validateObjectId(nid)) {
      try {
        const foundNote = await Note.findOne({ _id: nid, user: uid });
        if (foundNote) {
          foundNote.favourited = !foundNote.favourited;
          await foundNote.save();
          res.status(200).json({ message: "Toggle done." });
        } else {
          console.log("Couldn't find a note with that Id");
        }
      } catch (error) {
        console.error("Error: " + error.message);
      }
    } else {
      console.log("Invalid Id String");
    }
  }
);

//get all the user collections

app.get("/collections/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  if (validateObjectId(uid)) {
    const response = await Collection.find({ user: uid });
    res.json(response);
  } else {
    console.log("Invalid Id String");
  }
});

//create collection
app.post("/createCollection", ensureAuthenticated, async (req, res) => {
  const collectionName = req.body.name;
  const uid = req.body.userID;
  const collection = new Collection({
    name: collectionName,
    user: uid,
  });
  await collection.save().then(() => {
    console.log("new collection saved");
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
