const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model("User", userSchema, "login");