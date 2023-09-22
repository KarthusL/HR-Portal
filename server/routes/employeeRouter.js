const router = require("express").Router();
const upload = require("../middleware/verifyFileHandlerMiddleware");
const verifyTokenMiddleware = require("../middleware/verifyTokenMiddleware");
const personalInfoController = require("../controllers/employee/personalInfoController");
const personalDocumentController = require("../controllers/employee/personalDocumentController");

router.post(
  "/create_userInfo",
  verifyTokenMiddleware,
  upload.fields([{ name: "files" }, { name: "json" }]),
  personalInfoController.create_personal_info,
  personalDocumentController.upload_documents
);

router.post(
  "/upload",
  verifyTokenMiddleware,
  upload.array("files"),
  personalDocumentController.upload_documents
);

router.get(
  "/download",
  verifyTokenMiddleware,
  personalDocumentController.download_document
);

router.put(
  "/updateInfo",
  upload.fields([{ name: "updatedData", maxCount: 1 }]),
  verifyTokenMiddleware,
  personalInfoController.update_personal_info
);

router.get(
  "/getInfo",
  verifyTokenMiddleware,
  personalInfoController.get_employee_info
);

module.exports = router;
