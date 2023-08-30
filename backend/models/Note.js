import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  createdAt: {
    type: String,
    immutable: true,
    default: () => {
      let currentDate = new Date();
      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();
      const date = day + "/" + month + "/" + year;
      return date;
    },
  },
  favourited: {
    type: Boolean,
    default: false,
  },
});

const Note = mongoose.model("note", NoteSchema);

export default Note;
