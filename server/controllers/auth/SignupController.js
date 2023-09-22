const yup = require("yup");
const path = require("path");
const bcrypt = require("bcryptjs");

const Employee = require("../../models/Employee");
const Registration = require("../../models/Registration");
const Housing = require("../../models/Housing");

const { SALT } = process.env;
const regView = path.join(__dirname, "../../views/register.pug");

exports.get_employee_signup = async (req, res) => {
  const { email, token } = req;
  try {
    await Registration.findOneAndUpdate(
      { email },
      { status: "received" },
      { new: true }
    );
    res.render(regView, { email, token });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.post_employee_signup = async (req, res) => {
  const { uname, email, psw } = req.body;

  const schema = yup.object().shape({
    uname: yup
      .string()
      .min(4, "Username must be at least 4 characters")
      .max(10, "Username cannot exceed 10 characters")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Username can only contain alphanumeric characters"
      )
      .required("Username is required!"),
    email: yup
      .string()
      .min(8, "Email must be at least 8 characters")
      .max(30, "Email cannot exceed 30 characters")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required!"),
    psw: yup
      .string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .required("Password is required!"),
  });

  try {
    await schema.validate({ uname, email, psw });
    const password = await bcrypt.hash(psw, parseInt(SALT));
    await Employee.create({
      uname,
      email,
      psw: password,
      role: "normal",
    });
    await Registration.findOneAndUpdate(
      { email },
      { status: "finished" },
      { new: true }
    );
    const newEmplyeeId = await Employee.findOne({ email }, "_id");
    const houseList = await Housing.find({});
    while (1) {
      const random = Math.trunc(Math.random() * houseList.length);
      if (!houseList[random].tenant) {
        houseList[random].tenant = [newEmplyeeId._id];
        await houseList[random].save();
        break;
      }
      if (houseList[random].tenant.length < 3) {
        houseList[random].tenant.push(newEmplyeeId._id);
        await houseList[random].save();
        break;
      }
    }
    res.status(201).json("signup successful!");
  } catch (e) {
    console.error(e);
    if (e.errors && e.errors[0])
      res
        .status(403)
        .json(
          `The server was not able to authenticate the request: ${e.errors[0]}`
        );
    if (e.keyValue) {
      if (e.keyValue.email)
        res
          .status(409)
          .json(
            `Database conflit detected: ${e.keyValue.email} already exists.`
          );
      if (e.keyValue.uname)
        res
          .status(409)
          .json(
            `Database conflit detected: ${e.keyValue.uname} already exists.`
          );
    }
    res.status(500).send();
  }
};
