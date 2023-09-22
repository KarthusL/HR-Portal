const mongoose = require("mongoose");
const AddressSchema = require("./shared_models/Address");
const PersonSchema = require("./shared_models/Person");
const HousingSchema = require("./Housing");

// const OPT_DOCSchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     required: true,
//   },
//   // Here, 'doc' would be the URL or key of the file in S3
//   doc: { type: String, required: true },
//   msg: String,
// });

const VisaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["H1-B", "L2", "F1(CPT/OPT)", "H4", "Other"],
    required: true,
  },
  visa_tltle: { type: String },
  // opt_doc: [{ type: String, enum: ["receipt"] }],
  // opt_doc: [{ type: String, enum: ["receipt", "EAD", "I-983", "I-20"] }],
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const DLSchema = new mongoose.Schema({
  number: { type: String, required: true },
  exp: { type: Date, required: true },
  dl_doc: { type: String, required: true },
});

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
});

const Refer_PersonSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  mname: { type: String },
  lname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  relationship: { type: String, required: true },
});

const Employee_InfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Not Started", "Rejected", "Pending", "Approved"],
    required: true,
    default: "Not Started",
  },
  msg: String,
  pic: {
    type: String,
    default:
      "https://hr-project-bucket123450.s3.amazonaws.com/default_pic/Unknown.jpeg",
  },
  fname: { type: String, required: true },
  mname: String,
  lname: { type: String, required: true },
  // perferred name
  pname: String,
  gender: { type: String, enum: ["male", "female", "I don't wish to answer"] },
  ssn: { type: String, required: true },
  dob: { type: Date, required: true },
  cur_add: { type: AddressSchema, required: true },
  cell_phone: { type: String, required: true },
  work_phone: { type: String },
  // work_phone is not required per requirements
  //   work_phone: { type: Number, required: true },
  citizen_status: { type: String, enum: ["Green Card", "Citizen", "Other"] },
  visa: VisaSchema,
  // driver license
  dl: DLSchema,
  car: CarSchema,
  ref: Refer_PersonSchema,
  emergency: [
    {
      fname: { type: String, required: true },
      mname: { type: String, default: null },
      lname: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  visa_status: {
    type: String,
    enum: ["waiting", "pending", "approved", "rejected", null],
    default: "pending",
  },
  visa_status_msg: {
    type: String,
  },
  next_file: {
    type: String,
    enum: ["receipt", "EAD", "I-983", "I-20", "done"],
  },
});

const EmployeeInfo = mongoose.model("EmployeeInfo", Employee_InfoSchema);
module.exports = EmployeeInfo;
