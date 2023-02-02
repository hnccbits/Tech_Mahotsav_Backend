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
    const event = await Event.find();
    event.forEach((currentItem) => {
      delete currentItem["participants"];
      //console.log(currentItem);
    });
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
    const isregistered = await Event.findOne({
      _id: _id,
      "participants.captainemail": user.email
    });
    console.log( isregistered);
    if ( isregistered != null)
      throw new Error(
        "Already registered  for this event by captain using using this email id"
      );
    const obj = {
      teamname,
      participant,
      captainemail: user.email
    };
    // console.log(obj);
    const event = await Event.findById({ _id });
    event.participants.unshift(obj);
    await event.save();
    res.status(201).json({ data: "Success" });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
