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
    prize: {
      type: String
    },
    registrationopen: {
      type: Boolean,
      default: true
    },
    dateofevent: {
      type: Date,
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

const resolveBlobName = (req, file) => {
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
  { name: "rulebook", maxCount: 1 }
]);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
