const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator: isEmail,
        message: "{VALUE} is not a valid email",
      },
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    followers: [mongoose.Types.ObjectId],
    following: [mongoose.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const encrypted = await bcrypt.hash(user.password, 8);
    user.password = encrypted;
  }

  next();
});

UserSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email });

    if (!user) {
      return reject("Invalid Credentials!");
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return reject("Invalid Credentials!");
    }

    resolve(user);
  });
};

module.exports = mongoose.model("User", UserSchema);
