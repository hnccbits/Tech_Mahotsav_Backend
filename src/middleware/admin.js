const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const admin = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!admin) {
      throw new Error();
    }

    req.token = token;
    req.user = admin;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid Authorization token" });
  }
};

module.exports = admin;
