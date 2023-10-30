/*** Imports ***/
import dotenv from "dotenv";
dotenv.config();
import { ObjectId, ServerApiVersion } from "mongodb";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { stringify, parse } from "flatted";
import MongoStore from "connect-mongo";

const app = express();

// Connection
const uri = `mongodb+srv://akamar5050:${process.env.MONGO_PWD}@cluster0.ucoihg1.mongodb.net/recapApp?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("connected to dB");
  })
  .catch((err) => {
    console.error(err);
  });

/***** Middlewares *****/

app.use(express.json());

const allowedOrigins = ["https://recapnote.netlify.app"];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:3000");
}

const options = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"],
  credentials: true,
};

app.use(cors(options));
app.use(logger("combined"));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 48 * 60 * 60,
      touchAfter: 24 * 3600,
      autoRemove: "native",
    }),
    cookie: {
      secure: process.env.ENV === "PRODUCTION",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

/*******  Module Imports  ******/
import Note from "./models/Note.js";
import User from "./models/User.js";
import Collection from "./models/Collection.js";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Auth Middlewares
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
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

/**Register */
app.post("/register", (req, res) => {
  const username = JSON.stringify(req.body.username);
  User.findOne({ username: username })
    .then((existingUser, username) => {
      if (existingUser) {
        return res.status(409).json({
          message: "Username already exists. Login Instead.",
          authenticated: false,
        });
      }
      const newUser = {
        username: username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };
      const password = req.body.password;

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!password.match(passwordRegex)) {
        return res.status(400).json({
          success: false,
          message: "Password must meet the required criteria!",
          authenticated: false,
        });
      }
      User.register(newUser, password, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(400).json({
            message: "Registration failed",
            authenticated: false,
          });
        }
        passport.authenticate("local", { session: true })(req, res, () => {
          res.status(201).json({
            message: "Registration successful",
            user: req.user,
            authenticated: true,
          });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        message: "something went wrong, try again",
        authenticated: false,
      });
    });
});

//Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong, try again.",
        authenticated: false,
      });
    }

    if (!user) {
      return res.status(403).json({
        message: "Wrong username or password.",
        authenticated: false,
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(200).send({
        message: "Login successful",
        user: user,
        authenticated: true,
      });
    });
  })(req, res, next);
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
app.get("/user/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  if (validateObjectId(uid)) {
    const response = await User.findOne({ _id: uid });
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

  try {
    const savedNote = await note.save();
    res.status(200).json({
      success: true,
      message: "Note Added Successfully!",
      note: savedNote,
    });
  } catch (err) {
    console.error("error adding note:", err);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, try again!" });
  }
});

//deletes a note
app.delete("/note/delete/:nid/:uid", ensureAuthenticated, async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (validateObjectId(uid) && validateObjectId(nid)) {
    await Note.findOneAndRemove({ _id: nid, user: uid }).then((deletedNote) => {
      if (deletedNote) {
        return res.status(200).json();
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
    const collection = await Note.findOneAndUpdate(
      { _id: nid, user: uid },
      { title: title, content: content }
    );
    res.send(stringify(collection));
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

/******  COLLECTION ***** */

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

//add note to collection
app.patch(
  "/collection/addnotes/:cid/:uid",
  ensureAuthenticated,
  async (req, res) => {
    const cid = new ObjectId(req.params.cid);
    const uid = new ObjectId(req.params.uid);
    const nid = new ObjectId(req.body.noteId);

    if (
      validateObjectId(uid) &&
      validateObjectId(cid) &&
      validateObjectId(nid)
    ) {
      const collection = await Collection.findOne({
        _id: cid,
        notes: { $in: [nid] },
      }).exec();

      if (collection) {
        return res
          .status(200)
          .json({ message: "Note already exist in collection" });
      }

      await Collection.findOneAndUpdate(
        { _id: cid, user: uid },
        { $addToSet: { notes: nid } }
      );
      return res.status(200).json({ message: "Note added successfully" });
    } else {
      console.log("Invalid Id String");
      return res.status(500).json();
    }
  }
);

//delete note from collection
app.patch(
  "/collection/deletenote/:cid/:uid",
  ensureAuthenticated,
  async (req, res) => {
    const cid = new ObjectId(req.params.cid);
    const uid = new ObjectId(req.params.uid);
    const nid = new ObjectId(req.body.noteId);

    if (
      validateObjectId(uid) &&
      validateObjectId(cid) &&
      validateObjectId(nid)
    ) {
      await Collection.findOneAndUpdate(
        { _id: cid, user: uid },
        { $pull: { notes: nid } }
      );
      res.status(200).json();
    } else {
      console.log("Invalid Id String");
    }
  }
);

//get all notes in a collection

app.get("/view-collection/:cid/:uid", ensureAuthenticated, async (req, res) => {
  try {
    const cid = new ObjectId(req.params.cid);
    const uid = new ObjectId(req.params.uid);

    if (!validateObjectId(uid) || !validateObjectId(cid)) {
      console.log("Invalid ID String");
      res.status(400).json({ error: "Invalid ID String" });
      return;
    }

    const collection = await Collection.findOne({
      _id: cid,
      user: uid,
    }).populate("notes");

    if (!collection) {
      console.log("Collection not found");
      res.status(404).json({ error: "Collection not found" });
      return;
    }

    res.send(stringify(collection));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create collection
app.post("/createCollection", ensureAuthenticated, async (req, res) => {
  const collectionName = req.body.name;
  const uid = new ObjectId(req.body.userID);
  const imageUrl = req.body.imageUrl;

  if (validateObjectId(uid)) {
    const collection = new Collection({
      name: collectionName,
      user: uid,
      image: imageUrl,
    });

    try {
      const savedCollection = await collection.save();
      res.status(200).json({
        success: true,
        message: "Collection Added Successfully!",
        collection: savedCollection,
      });
    } catch (err) {
      console.error("error adding note:", err);
      res
        .status(500)
        .json({ success: false, message: "Something went wrong, try again!" });
    }
  }
});

//delete collection
app.delete(
  "/collection/delete/:cid/:uid",
  ensureAuthenticated,
  async (req, res) => {
    const uid = new ObjectId(req.params.uid);
    const cid = new ObjectId(req.params.cid);

    if (validateObjectId(uid) && validateObjectId(cid)) {
      await Collection.findOneAndRemove({ _id: cid, user: uid }).then(
        (deletedCollection) => {
          if (deletedCollection) {
            console.log("collection deleted");
          } else {
            console.log("No collection found or deleted");
          }
        }
      );
    } else {
      console.log("Invalid Id String");
    }
  }
);

//get random unsplash image for collection
const clientId = process.env.UNSPLASH_CLIENT_ID;
const unsplashRoot = "https://api.unsplash.com";

app.get("/randomImage/:query", async (req, res) => {
  const query = req.params.query;

  try {
    const response = await fetch(
      `${unsplashRoot}/photos/random?query=${query}&client_id=${clientId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch photo data from Unsplash.");
    }
    const photoData = await response.json();
    res.json(photoData.urls.regular);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the image." });
  }
});

/******************** */
app.listen(process.env.PORT || 3001, () => {
  console.log("Server started on port 3001");
});
