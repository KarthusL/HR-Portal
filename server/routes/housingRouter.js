const router = require("express").Router();
const upload = require("../middleware/verifyFileHandlerMiddleware");
const verifyTokenMiddleware = require("../middleware/verifyTokenMiddleware");
const housingController = require("../controllers/employee/housingController");

router.get(
  "/employee_house",
  verifyTokenMiddleware,
  housingController.employee_house
);

router.post(
  "/create_fac_report",
  verifyTokenMiddleware,
  housingController.create_fac_report
);

router.post(
  "/add_comment_to_report",
  verifyTokenMiddleware,
  housingController.add_comment_to_report
);

router.put(
  "/update_comment_on_report",
  verifyTokenMiddleware,
  housingController.update_comment_on_report
);

module.exports = router;
