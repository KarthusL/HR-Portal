const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddressSchema = require("./shared_models/Address");
const PersonSchema = require("./shared_models/Person");

const FurnitureSchema = new Schema({
  beds: { type: Number, required: true },
  mattresses: { type: Number, required: true },
  tables: { type: Number, required: true },
  chairs: { type: Number, required: true },
});

const CommentSchema = new Schema({
  desc: { type: String, required: true },
  created_by: { type: String, required: true },
  ts: { type: Date, default: Date.now },
});

const Fac_ReportSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  created_by: { type: String, required: true },
  ts: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "Open",
    enum: ["Open", "In Progress", "Closed"],
    required: true,
  },
  comments: [CommentSchema],
});

const HousingSchema = new Schema({
  address: { type: AddressSchema, required: true },
  tenant: [{ type: Schema.Types.ObjectId, ref: "EmployeeInfo" }],
  reports: [Fac_ReportSchema],
  landlord: { type: PersonSchema, required: true },
  furniture: FurnitureSchema,
});

const Housing = mongoose.model("Housing", HousingSchema);
module.exports = Housing;
