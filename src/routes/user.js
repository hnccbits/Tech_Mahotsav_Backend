const auth = require("../middleware/auth");
const router = require("express").Router();
const bodyParser = require("body-parser");
const User = require("../model/user");
router.use(bodyParser.json());
////////////////////////////////////////

/**
 * @route POST api/user
 * @desc returns all the user
 * @access Private
 */
router.get("/user", auth, async (req, res) => {
  try {
    const user = (await User.find()).reverse();
    res.status(200).json({ data: user });
  } catch ({ message }) {
    res.status(500).json({ error: message });
  }
});

/**
 * @route PUT api/user/:id
 * @desc Updates specific user data from the id provided in the parameter
 * @access Private
 */
router.put("/user/:id", auth, async (req, res) => {
  try {
    const { id: _id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "email",
      "password",
      "dob",
      "gender",
      "about",
      "country",
      "language",
      "game",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation || updates.length === 0) {
      return res.status(400).json({ error: "Invalid updates!" });
    }
    const user = await User.findById({ _id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ data: user });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route PATCH api/user/:id
 * @desc Delete specific user data from the id provided in the parameter
 * @access Private
 */
router.patch("/user/:id", auth, async (req, res) => {
  try {
    const deletes = Object.keys(req.body);
    const user = await User.findById({ _id: req.params.id });
    const allowedDeletes = ["gender", "about", "country", "language", "game"];
    const isValidOperation = deletes.every((update) =>
      allowedDeletes.includes(update)
    );
    if (!isValidOperation || deletes.length === 0) {
      return res.status(400).json({ error: "Invalid deletes!" });
    }
    await user.updateOne({ $unset: req.body });
    await user.save();
    const user2 = await User.findById({ _id: req.params.id });
    res.status(201).json({ data: user2 });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route DELETE api/user
 * @desc Deletes user from the id provided in the parameter
 * @access Private
 */
router.delete("/user/:id", auth, async (req, res) => {
  try {
    const { id:_id } = req.params;
    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    res.status(200).json({ data: user });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
