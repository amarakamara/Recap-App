import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Note from "./note.js";
import User from "./user.js";

const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

collectionSchema.plugin(passportLocalMongoose);

const Collection = mongoose.model("collection", collectionSchema);

export default Collection;
