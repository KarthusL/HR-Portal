const jwt = require("jsonwebtoken");

const Employee = require("../../models/Employee");

const { JWT_KEY } = process.env;

exports.check_token = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a token",
      });
    }

    let decodedInfo;
    try {
      decodedInfo = jwt.verify(token, JWT_KEY);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: "fail",
          message: "Token expired",
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid token",
        });
      }
    }

    const employee = await Employee.findOne({ email: decodedInfo.email });

    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Token is valid",
      email: decodedInfo.email,
      role: decodedInfo.role,
      uname: employee.uname,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
