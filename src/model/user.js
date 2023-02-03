const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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
    phone: {
      required: true,
      type: String,
      maxlength: 100,
      unique: true
    },
    whatsapp: {
      unique: true,
      maxlength: 100,
      type: String,
      required: true
    },
    college: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    branch: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
          })
        )
          throw new Error();
      }
    },

    gender: {
      type: String,
      enum: ["M", "F", "O"]
    },

    tokens: [
      {
        token: {
          type: String,
          trim: true
        }
      }
    ]
  },
  { timestamps: true }
);
/*
userSchema.virtual("Event", {
  ref: "Event",
  localField: "_id",
  foreignField: "user"
});
*/

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong password");
  }
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.__v;
  delete user.updatedAt;
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), name: user.name },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
