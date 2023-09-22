const EmployeeInfo = require("../models/EmployeeInfo");

const verifyHRMiddleware = (req, res, next) => {
  if (req.role === "normal") return res.status(401).send();
  else if (req.role === "hr") next();
  else return res.status(401).send();
};

const verifyNormalMiddleware = async (req, res, next) => {
  if (req.role === "normal") {
    const onboardingStatus = await EmployeeInfo.findOne({ email: req.email })
      .status;
    if (onboardingStatus === "approved") next();
    else return res.status(304).send(); //send redirection code to front-end
  } else if (req.role === "hr") return res.status(401).send();
  else return res.status(401).send();
};

module.exports = { verifyHRMiddleware, verifyNormalMiddleware };
