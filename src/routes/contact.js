const router = require("express").Router();
const Contact = require("../model/contact");
////////////////////////////////////////////////////////

/**
 * @route POST api/contact
 * @desc Add contact form data and return success
 * @access Public
 */
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({
      name,
      email,
      message
    });
    await contact.save();
    res.status(201).json({ data: "success" });
  } catch ({ message }) {
    res.status(400).json({ error: message });
  }
});

module.exports = router;
