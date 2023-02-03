const mongoose = require("mongoose");
const validator = require("validator");
const multer = require('multer');
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    desc: {
      type: String,
      required: true,
      trim: true
    },
    coverimg: {
      type: String
    },
    rulebook: {
      type: String,
      default: "notuploaded"
    },
    club: {
      type: String,
      required: true,
      enum: ["ISTE", "IETE", "HnCC", "SAE", "Model Club"]
    },
    teamsize: {
      type: String,
      required: true
    },
    participants: [
      {
        participant: [
          {
            name: {
              type: String,
              required: true,
              trim: true,
              minlength: 3,
              maxlength: 100
            },
            email: {
              type: String,
              // required: true,
              trim: true,
              lowercase: true,
              validate(value) {
                if (!validator.isEmail(value)) {
                  throw new Error("Email is invalid");
                }
              }
            },
            phone: {
              required: true,
              type: String,
              maxlength: 10
            },
            whatsapp: {
              maxlength: 10,
              type: String,
              required: true
            },
            gender: {
              type: String,
              required: true,
              enum: ["M", "F", "O"]
            }
          }
        ],
        captainemail: {
          type: String,
          unique: true,
          trim: true,
          lowercase: true,
          validate(value) {
            if (!validator.isEmail(value)) {
              throw new Error("Email is invalid");
            }
          }
        },
        teamname: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 100
        }
      }
    ]
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;


