const verifyURLMiddleware = (_req, res) => {
  return res.redirect("/api"); //redirect to root of backend api
};

module.exports = verifyURLMiddleware;
