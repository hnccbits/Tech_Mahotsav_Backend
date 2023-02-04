const router = require("express").Router();
const Admin = require("../model/admin");
const Event = require("../model/event");
const admin = require("../middleware/admin");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
////////////////////////////////////////////////////////

/**
 * @route POST api/admin/login
 * @desc Login admin and return Admin object and token
 * @access Public
 */
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findByCredentials({ email, password });
    const token = await user.generateAuthToken();
    res.status(201).json({ data: { user, token, admin: true } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route GET api/admin/logout
 * @desc Logs out admin and deletes token from db
 * @access Admin
 */
router.get("/admin/logout", admin, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.status(200).json({ data: "Logout success" });
  } catch ({ message }) {
    res.status(500).json({ error: message });
  }
});

/**
 * @route POST api/admin/register
 * @desc Registers admin and return User object and token
 * @access Public
 */
router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = new Admin({
      name,
      email,
      password
    });
    const token = await admin.generateAuthToken();
    await admin.save();
    res.status(201).json({ data: { user: admin, token } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route POST api/admin/add/event
 * @desc Add events
 * @access Admin
 */
router.post("/admin/add/event", admin, async (req, res) => {
  try {
    const { user } = req;
    Event.uploadFile(req, res, async (z, err) => {
      if (err) throw new Error("Multer Error");
      const { name: club } = user;
      const { name, desc, teamsize } = req.body;
      const coverimg = req.files.coverimg[0].blobName;
      const rulebook = req.files.rulebook[0].blobName;

      const event = new Event({
        name, //event name eg- hackathon
        club,
        desc,
        teamsize,
        coverimg,
        rulebook
      });
      await event.save();
      res.status(201).json({ data: { event } });
    });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route POST api/admin/add/event
 * @desc Add events
 * @access Admin
 */
router.patch("/admin/update/event", admin, async (req, res) => {
  try {
    const { name, desc, teamsize, id: _id } = req.body;

    const event = await Event.findById({ _id });
    if (!event) throw new Error("Invalid Event id");
    Event.uploadFile(req, res, async (err) => {
      if (err) throw new Error("Multer Error");
      const { user } = req;
      const { name: club } = user;
      event.name = name;
      event.teamsize = teamsize;
      event.club = club;
      event.desc = desc;
      if (req.files) {
        const coverimg = req.files.coverimg[0].blobName;
        const rulebook = req.files.rulebook[0].blobName;
        event.coverimg = coverimg;
        event.rulebook = rulebook;
      }
      await event.save();
      res.status(201).json({ data: { event } });
    });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

router.delete("/admin/delete/event", admin, async (req, res) => {
  try {
    const { _id } = req.body;
    const { user } = req;
    const { name: names } = user;
    const event = await Event.findById({ _id });
    if (event.club != names) throw new Error("Unautharized");
    await Event.findByIdAndDelete({ _id });
    res.status(201).json({ data: "success" });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route POST api/admin/get/event
 * @desc Returns the list of events added by Admin
 * @access Admin
 */

router.get("/admin/get/event", admin, async (req, res) => {
  try {
    const { user } = req;
    const { name: names } = user;
    const event = await Event.find({ club: names });
    res.status(201).json({ data: { event } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
