const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const yup = require("yup");

const EmployeeInfo = require("../../models/EmployeeInfo");

const emergencyContactSchema = yup.object().shape({
  fname: yup.string().required(),
  lname: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().email().required(),
  relationship: yup.string(),
});

const personalInfoSchema = yup.object().shape({
  email: yup.string().email().required(),
  // status: yup.string().oneOf(["Not Started", "Rejected", "Pending"]),
  fname: yup.string().required(),
  lname: yup.string().required(),
  ssn: yup.string().required(),
  dob: yup.date().required(),
  cell_phone: yup.number().required(),
  cur_add: yup.object().required(),
  emergency: yup.array().of(emergencyContactSchema),
});

exports.create_personal_info = async (req, res, next) => {
  console.log("***starting create_personal_info***");
  try {
    const email = req.email;
    const jsonFile = req.files.json[0];

    // Since it's a file, we need to convert it to a JSON object
    const json = JSON.parse(jsonFile.buffer.toString());

    // Validate the input
    try {
      await personalInfoSchema.validate(json);
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ error: "Invalid input", details: err.errors });
    }

    // Check for required fields
    if (!json.fname || !json.lname || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let newEmployee;
    try {
      newEmployee = await EmployeeInfo.create({
        email: email,
        status: "Pending",
        fname: json.fname,
        mname: json.mname,
        lname: json.lname,
        pname: json.pname,
        gender: json.gender,
        ssn: json.ssn,
        dob: new Date(json.dob),
        cur_add: json.cur_add,
        cell_phone: json.cell_phone,
        work_phone: json.work_phone,
        citizen_status: json.citizen_status,
        visa: json.visa,
        dl: json.dl,
        car: json.car,
        ref: json.ref,
        emergency: json.emergency,
        next_file: "receipt",
      });
    } catch (err) {
      console.error(err);
      console.log(email);
      return res.status(409).json({ error: err.message });
    }

    // res
    //   .status(201)
    //   .json({ message: "Personal info created!", data: newEmployee });

    // pass the newEmployee to the next middleware
    console.log("***ending create_personal_info***");
    if (!req.files.files || !req.files) {
      return res.status(201).json({
        message: "Personal info created!",
      });
    } else {
      res.locals.newEmployee = newEmployee;
      next();
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the personal info" });
  }
};

exports.update_personal_info = async (req, res) => {
  console.log("***starting update_personal_info***");
  try {
    const email = req.email;
    const jsonFile = req.files.updatedData[0];

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!jsonFile) {
      return res.status(400).json({ error: "JSON file is required" });
    }

    // Since it's a file, we need to convert it to a JSON object
    // Convert the uploaded file buffer to JSON
    let json;
    try {
      console.log(req.files.updatedData[0]);
      json = JSON.parse(jsonFile.buffer.toString());
      await personalInfoSchema.validate(json);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Invalid JSON file" });
    }

    // Validate the input
    let employeeInfo = await EmployeeInfo.findOne({ email: email });
    if (employeeInfo.status === "Rejected") {
      employeeInfo.status = "Pending";
      employeeInfo.msg = null;
    }
    await employeeInfo.save();
    if (!employeeInfo) {
      return res
        .status(404)
        .json({ error: "No employeeInfo found with the provided email" });
    }

    if (employeeInfo.email !== email) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // Update the employeeInfo document
    let updatedEmployee;
    try {
      updatedEmployee = await EmployeeInfo.findOneAndUpdate(
        { email: email },
        {
          email: email,
          fname: json.fname,
          mname: json.mname,
          lname: json.lname,
          pname: json.pname,
          gender: json.gender,
          ssn: json.ssn,
          dob: new Date(json.dob),
          cur_add: json.cur_add,
          cell_phone: json.cell_phone,
          work_phone: json.work_phone,
          citizen_status: json.citizen_status,
          visa: json.visa,
          dl: json.dl,
          car: json.car,
          ref: json.ref,
          emergency: json.emergency,
        },
        { new: true }
      );
    } catch (err) {
      console.error(err);
      console.log(email);
      return res.status(409).json({ error: err.message });
    }

    if (!updatedEmployee) {
      return res
        .status(404)
        .json({ error: "No employeeInfo found with the provided email" });
    }

    console.log("***ending update_personal_info***");
    res.status(200).json({
      message: "Personal info updated successfully!",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the personal info" });
  }
};

exports.get_employee_info = async (req, res) => {
  console.log("***starting get_personal_info***");
  try {
    let targetUserEmail;
    const email = req.email;
    const role = req.role;

    if (role === "hr") {
      targetUserEmail = req.query.targetUserEmail;
    } else {
      targetUserEmail = email;
    }

    let employee = await EmployeeInfo.findOne({ email: targetUserEmail });
    if (!employee) {
      return res.status(204).json({
        message:
          "No employeeInfo found, please check if you have targetUserEmail in req.body",
      });
    }

    console.log("***ending get_personal_info***");
    res.status(200).json({
      message: "Personal info fetched successfully!",
      data: employee,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the personal info" });
  }
};
