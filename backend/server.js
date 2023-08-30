import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/recapApp")
  .then(() => console.log("connected to dB"))
  .catch((err) => {
    console.error(err);
  });

import Note from "./models/note.js";

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

/*Update favourite note*/

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
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
