const router = require("express").Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
////////////////////////////////////////////////////////

/**
 * @route POST api/login
 * @desc Login user and return User object and token
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials({ email, password });
    const token = await user.generateAuthToken();
    res.status(201).json({ data: { user, token } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route GET api/logout
 * @desc Logs out user and deletes token from db
 * @access Private
 */
router.get("/logout", auth, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.status(200).json({ data: "Logout success" });
  } catch ({ message }) {
    res.status(500).json({ error: message });
  }
});

module.exports = router;
