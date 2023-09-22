const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Employee = require("../models/Employee");
const { LOGIN_URL } = process.env;

const { JWT_KEY } = process.env;

const verifyTokenMiddleware = async (req, res, next) => {
  const token =
    (req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[1]) || //Bearer <token>
    (req.params && req.params.token) ||
    (req.query && req.query.token);
  if (!token) {
    return res.redirect("/api");
  }
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    if (!decoded.email) return res.redirect(LOGIN_URL);
    const user = await Employee.findOne({ email: decoded.email });
    if (!user) return res.redirect(LOGIN_URL);
    else {
      req.token = token;
      req.email = decoded.email;
      req.role = decoded.role;
      next();
    }
  } catch (error) {
    console.error(error);
    return res.redirect(LOGIN_URL);
  }
};

module.exports = verifyTokenMiddleware;
