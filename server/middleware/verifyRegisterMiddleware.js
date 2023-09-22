const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { JWT_KEY } = process.env;

const Registration = require("../models/Registration");

const { LOGIN_URL } = process.env;

const verifyRegisterMiddleware = async (req, res, next) => {
  const token =
    (req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[1]) || //Bearer <token>
    (req.params && req.params.token) ||
    (req.query && req.query.token);
  if (!token) {
    return res.redirect(LOGIN_URL);
  }
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    if (!decoded.email || (decoded.email && decoded.role))
      return res.redirect(LOGIN_URL);
    else {
      const status = await Registration.findOne(
        { email: decoded.email },
        "status"
      );
      //if new employee already registered, then jwt invalid no matter whether or not reach 3h limit
      if (status.status === "finished") return res.redirect(LOGIN_URL);
      req.token = token;
      req.email = decoded.email;
      next();
    }
  } catch (error) {
    console.error(error);
    if (error.message === "jwt expired") return res.redirect(LOGIN_URL);
    return res.status(500).send();
  }
};

module.exports = verifyRegisterMiddleware;
