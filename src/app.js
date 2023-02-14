const express = require("express");
const app = new express();
const cors = require("cors");
const prefix = "/api";
const path = require("path");
require("./model/mongoose");
require("./config/mailer");

const register_router = require("./routes/register");
const login_router = require("./routes/login");
const contact_router = require("./routes/contact");
const event_route = require("./routes/event");
const admin_route = require("./routes/admin");
app
  .use(cors())
  .use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
  })
  .use(express.json())
  .use(prefix, register_router)
  .use(prefix, admin_route)
  .use(prefix, contact_router)
  .use(prefix, event_route)
  .use(prefix, login_router)
  .use(express.static(path.join(__dirname, "..", "client", ".next", "server")))
  .use(express.static("public"))
  .get(
    "*",
    (_, res) => res.status(200).json({ data: "Tech Mahotsav' 23" })
    /* .sendFile(
        path.join(
          __dirname,
          "..",
          "client",
          ".next",
          "server",
          "pages",
          "index.html"
        )
      )*/
  );
module.exports = { app };
