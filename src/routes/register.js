const router = require("express").Router();
const User = require("../model/user");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
///////////////////////////////////////////

/**
 * @route POST api/register
 * @desc Registers user and return User object and token
 * @access Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, branch, phone, password, whatsapp, college, gender } =
      req.body;
    const user = new User({
      name,
      email,
      branch,
      phone,
      password,
      whatsapp,
      college,
      gender
    });
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).json({ data: { user, token } });
    sendMail({
      to: email,
      subject: "Registration successful!",
      text: `Dear ${name}, you have successfully registered on the Techmahotsav' 23 website.`
    });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
