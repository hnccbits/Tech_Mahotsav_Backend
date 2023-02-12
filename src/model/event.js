const mongoose = require("mongoose");
const validator = require("validator");
const multer = require("multer");
const MulterAzureStorage =
  require("multer-azure-blob-storage").MulterAzureStorage;

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
    registrationopen: {
      type: Boolean,
      default: true
    },
    dateofevent: {
      type: String,
      required: true
    },
    coverimg: {
      type: String,
      required: true
    },
    rulebook: {
      type: String,
      required: true
    },
    problemstatement: {
      type: String
    },
    club: {
      type: String,
      required: true,
      enum: [
        "ISTE",
        "IETE",
        "HNCC",
        "SAE",
        "Model Club",
        "PIES",
        "ACE",
        "MES",
        "EES",
        "ECES",
        "CSEIT",
        "DHATVIKA",
        "SME",
        "QUMICA"
      ]
    },
    teamsize: {
      type: String,
      required: true
    },

    participants: [
      {
        teamname: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 50
        },
        captainemail: {
          type: String,
          trim: true,
          lowercase: true,
          validate(value) {
            if (!validator.isEmail(value)) {
              throw new Error("Email is invalid");
            }
          }
        },
        college: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100
        },
        branch: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100
        },
        city: {
          type: String,
          required: true,
          trime: true,
          maxlength: 50
        },
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
        ]
      }
    ]
  },
  { timestamps: true }
);

const resolveBlobName = (req, file) => {
  const { name } = req.body;
  // name = name.replace(" ", "-");
  return new Promise((resolve, reject) => {
    const blobName = Date.now().toString();
    resolve(blobName);
  });
};

const azureStorage = new MulterAzureStorage({
  containerName: "data",
  blobName: resolveBlobName,
  // metadata: resolveMetadata,
  // contentSettings: resolveContentSettings,
  containerAccessLevel: "container",
  urlExpirationTime: -1
});

eventSchema.statics.uploadFile = multer({
  storage: azureStorage
}).fields([
  { name: "coverimg", maxCount: 1 },
  { name: "rulebook", maxCount: 1 },
  { name: "problemstatement", maxCount: 1 }
]);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
