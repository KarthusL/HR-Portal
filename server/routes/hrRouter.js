const router = require("express").Router();

const verifyURLMiddleware = require("../middleware/verifyURLMiddleware");
const HRController = require("../controllers/hr");

//Employee Profile API
router.get("/profile", HRController.ProfileManagementController.get_employees);

//Visa Status Management API
router.get(
  "/visa",
  HRController.VisaManagementController.get_visa_employee_list
);
router.put("/visa", HRController.VisaManagementController.put_visa_file_review);

//Hiring Management API
router.get(
  "/hire",
  HRController.HiringManagementController.get_onboarding_info
);
router.get(
  "/hire_new",
  HRController.HiringManagementController.get_new_employee_list
);
router.put(
  "/hire",
  HRController.HiringManagementController.put_onboarding_review
);
router.post(
  "/hire",
  HRController.HiringManagementController.post_employee_email
);

//Housing Management API
router.get("/house", HRController.HousingManagementController.get_all_houses);
router.put(
  "/house",
  HRController.HousingManagementController.put_report_status_by_id
);
router.post("/house", HRController.HousingManagementController.post_new_house);
router.delete(
  "/house",
  HRController.HousingManagementController.delete_house_by_id
);

//Route Protection
router.get("*", verifyURLMiddleware);

module.exports = router;
