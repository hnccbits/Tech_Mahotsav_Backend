const router = require("express").Router();
const Admin = require("../model/admin");
const Event = require("../model/event");
const User = require("../model/user");
const admin = require("../middleware/admin");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const { generateXLSX } = require("../controller/excel");
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
    sendMail({
      to: email,
      subject: "Account logged in!",
      text: `Account logged in on Techmahotsav' 23 website.`
    });
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
    res.status(201).json({ data: { user: admin, token, admin: true } });
    sendMail({
      to: email,
      subject: "Registration successful!",
      text: `Dear ${name}, you have successfully registered on the Techmahotsav' 23 website.`
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
router.post("/admin/add/event", admin, async (req, res) => {
  try {
    const { user } = req;
    Event.uploadFile(req, res, async (err) => {
      if (err) throw new Error(err, "Multer Error");
      const { email, name: club } = user;
      const { name, dateofevent, desc, teamsize, prize } = req.body;
      const coverimg = req.files.coverimg[0].blobName;
      const rulebook = req.files.rulebook[0].blobName;

      const event = new Event({
        name, //event name eg- hackathon
        club,
        prize,
        desc,
        teamsize,
        coverimg,
        dateofevent,
        rulebook
      });
      await event.save();
      res.status(201).json({ data: { event } });
      sendMail({
        to: email,
        subject: `Event ${name} added successfully`,
        text: `
Event name - ${name},
Max team size - ${teamsize},
Prize Pool - Rs${prize},
Description - ${desc},`
      });
    });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route POST api/admin/update/event
 * @desc Update events
 * @access Admin
 */
router.patch("/admin/update/event", admin, async (req, res) => {
  try {
    const {
      name,
      desc,
      prize,
      dateofevent,
      registrationopen,
      teamsize,
      id: _id
    } = req.body;

    const event = await Event.findById({ _id });

    if (!event) throw new Error("Invalid Event id");
    const { user } = req;
    const { name: club, email } = user;

    if (event.club != x) throw new Error("Unautharized");
    Event.uploadFile(req, res, async (err) => {
      if (err) throw new Error("Multer Error");

      event.name = name;
      event.prize = prize;
      event.teamsize = teamsize;
      event.registrationopen = registrationopen;
      event.club = club;
      event.dateofevent = dateofevent;
      event.desc = desc;
      if (req.files.coverimg[0]?.blobName) {
        const coverimg = req.files.coverimg[0].blobName;
        event.coverimg = coverimg;
      }
      if (req.files.rulebook[0]?.blobName) {
        const rulebook = req.files.rulebook[0].blobName;
        event.rulebook = rulebook;
      }
      await event.save();
      res.status(201).json({ data: { event } });
      sendMail({
        to: email,
        subject: `Event ${name} details updated successfully`,
        text: `Update Data -

Event name - ${name},
Max team size - ${teamsize},
Pool Prize - ${prize},

Description - ${desc},
        `
      });
    });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

router.delete("/admin/delete/event", admin, async (req, res) => {
  try {
    const { _id } = req.body;
    const { user } = req;
    const { name, email } = user;
    const event = await Event.findById({ _id });
    if (event.club != name) throw new Error("Unautharized");
    await Event.findByIdAndDelete({ _id });
    res.status(201).json({ data: "success" });
    sendMail({
      to: email,
      subject: `Event ${event.name} deleted successfully`,
      text: `All data and participants details related to the event deleted successfully.
        `
    });
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
    console.log(user)
    const event = await Event.find({ club: names }).select(
      "-prize -rulebook -desc -dateofevent -teamsize -club "
    );

    res.status(201).json({ data: { event } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route GET api/admin/download/response
 * @desc Returns the data of event
 * @access Admin
 */

router.get("/admin/download/response", admin, async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.body;
    const { name: names } = user;
    let event = await Event.find({ club: names, _id });
    if (!event) throw new Error("_id not accessible");
    event = event[0].participants;
    const d = generateXLSX({
      club: names,
      events: event
    });
    res.status(201).download(d);
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
