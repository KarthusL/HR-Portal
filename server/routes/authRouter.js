const router = require("express").Router();

const verifyTokenMiddleware = require("../middleware/verifyTokenMiddleware");
const verifyURLMiddleware = require("../middleware/verifyURLMiddleware");
const verifyRegisterMiddleware = require("../middleware/verifyRegisterMiddleware");
const AuthController = require("../controllers/auth");

//Signup API
router.get(
  "/signup",
  verifyRegisterMiddleware,
  AuthController.SignupController.get_employee_signup
);
router.post(
  "/signup",
  verifyRegisterMiddleware,
  AuthController.SignupController.post_employee_signup
);

//Signin API
router.post("/signin", AuthController.SigninController.post_employee_login);

//Signout API
router.post(
  "/signout",
  verifyTokenMiddleware,
  AuthController.SignoutController.post_employee_logout
);

const authenticationController = require("../controllers/auth/authenticationController");
router.get(
  "/check_token",
  verifyTokenMiddleware,
  authenticationController.check_token
);

//Route Protection
router.get("*", verifyURLMiddleware);

module.exports = router;
