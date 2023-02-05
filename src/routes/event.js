const router = require("express").Router();
const Event = require("../model/event");
const bodyParser = require("body-parser");
const User = require("../model/user");
const auth = require("../middleware/auth");
router.use(bodyParser.json());
///////////////////////////////////////////

/**
 * @route GET api/event
 * @desc Return event
 * @access Public
 */
router.get("/event", async (req, res) => {
  try {
    const event = await Event.find().select("-participants");
    res.status(201).json({ data: { event } });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

/**
 * @route POST api/register/event
 * @desc Registers user for the event
 * @access Private
 */
router.post("/register/event", auth, async (req, res) => {
  try {
    const { teamname, participant, _id } = req.body;
    const { user } = req;
    const event = await Event.findById({ _id });
    if (!event) throw new Error("Event not found");
    if (!event.registrationopen) throw new Error("Registration closed");
    const isregistered = await Event.findOne({
      _id: _id,
      "participants.captainemail": user.email
    });
    const { name, email, college, city, phone, whatsapp, branch, gender } =
      user;
    if (isregistered != null)
      throw new Error(
        "Already registered for this event as captain using using this email id"
      );
    participant.unshift({
      name,
      email,
      gender,
      phone,
      whatsapp
    });
    const to = [];
    participant.forEach((obj) => {
      to.push(obj.email);
    });
    const obj = {
      teamname,
      college,
      branch,
      city,
      participant,
      captainemail: user.email
    };
    event.participants.unshift(obj);
    await event.save();
    sendMail({
      to: to,
      subject: "Registration Successful!",
      text: `Dear participant, you are succesfully enrolled for the event ${event.name}. Team captain - ${name} Team name - ${teamname}.`
    });
    res.status(201).json({ data: "Success" });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
