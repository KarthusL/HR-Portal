const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const yup = require("yup");

const Employee = require("../../models/Employee");

const { JWT_KEY } = process.env;

exports.post_employee_login = async (req, res) => {
  const { uname, psw } = req.body;
  const schema = yup.object().shape({
    uname: yup.string().required("Username is required!"),
    psw: yup.string().required("Password is required!"),
  });

  try {
    await schema.validate({ uname, psw });
    if (!uname || !psw) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username and password",
      });
    }
    const employee = await Employee.findOne({ uname });
    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const validPassword = await bcrypt.compare(psw, employee.psw);
    if (!validPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { email: employee.email, role: employee.role },
      JWT_KEY,
      { expiresIn: "24h" }
    );
    res.set("authorization", `Bearer ${token}`);
    return res.status(200).json({
      message: "Login successful",
      token: token,
      uname: uname,
      role: employee.role,
      email: employee.email,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
