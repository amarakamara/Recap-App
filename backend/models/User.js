import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Collection from "./collection.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
  },
  {
    autoIndex: false,
  }
);

userSchema.plugin(passportLocalMongoose, {
  passwordValidator: function (password, cb) {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.match(passwordRegex)) {
      return cb("Password must meet the required criteria");
    }
    return cb();
  },
});

const User = mongoose.model("user", userSchema);

export default User;
