const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }
    },
    name: {
      type: String,
      trim: true,
      minlength: 3,
      required: true,
      maxlength: 100
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

const User = mongoose.model("Contact", contactSchema);
module.exports = User;
