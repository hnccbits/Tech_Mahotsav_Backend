const mongoose = require("mongoose");
const User = require("../../src/model/user");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Aditya Kumar Mandal",
  email: "adityakumarmandal@gmail.com",
  password: "Three.1415",
  dob: "2000/01/08", //yyyy-mm-dd
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

dbSetup = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneId,
  userOne,
  dbSetup,
};
