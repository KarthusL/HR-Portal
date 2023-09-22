const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  email: { type: String, unique: true },
  name: { type: String, default: "Employee", required: true },
  link: { type: String, unique: true },
  status: { type: String, enum: ["sent", "received", "finished"] },
});

const Registration = mongoose.model("Registration", RegistrationSchema);
module.exports = Registration;
