const router = require("express").Router();
const verifyURLMiddleware = require("../middleware/verifyURLMiddleware");

router.get("*", verifyURLMiddleware);

module.exports = router;
