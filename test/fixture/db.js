const mongoose = require("mongoose");
const User = require("../../src/model/user");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  name: "Aditya Kumar",
  email: "adi@gmail.com",
  branch: "Prod",
  phone: "9709094733",
  password: "Aditya@2001",
  whatsapp: "9709094733",
  college: "BIT",
  gender: "M",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};
dbSetup = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneId,
  userOne,
  dbSetup
};
