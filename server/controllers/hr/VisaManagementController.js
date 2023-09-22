const EmployeeInfo = require("../../models/EmployeeInfo");

//visa manamgement list with search bar and "in progrees" or "all" display option
exports.get_visa_employee_list = async (req, res) => {
  const { identifier, val, progress } = req.query;

  const filter = {
    status: "Approved",
    visa: { $exists: true, $ne: null },
  };
  const attrs = "fname mname lname visa visa_status next_file email";
  if (identifier && val) filter[identifier] = { $regex: val, $options: "i" };
  if (progress === "In Progress") {
    filter.next_file = { $ne: "done" };
    filter["visa.type"] = "F1(CPT/OPT)";
  }
  try {
    const query = await EmployeeInfo.find(filter, attrs);
    if (!query || !query.length) res.status(200).json([]);
    else
      res.status(200).json(
        query.map((item) => {
          item = item.toObject();
          if (item.visa && item.visa.end) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastDay = new Date(item.visa.end);
            lastDay.setHours(0, 0, 0, 0);
            if (lastDay.getTime() - today.getTime() < 0) item.visa.remain = 0;
            else
              item.visa.remain = Math.trunc(
                (lastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );
          }
          if (item.next_file) {
            if (
              item.visa_status === "pending" ||
              item.visa_status === "rejected"
            )
              switch (item.next_file) {
                case "receipt":
                  item.visa_files = ["receipt"];
                  break;
                case "EAD":
                  item.visa_files = ["receipt", "EAD"];
                  break;
                case "I-983":
                  item.visa_files = ["receipt", "EAD", "I-983"];
                  break;
                case "I-20":
                  item.visa_files = ["receipt", "EAD", "I-983", "I-20"];
                  break;
                default:
                  item.visa_files = [];
                  break;
              }
            else if (item.visa_status === "waiting")
              switch (item.next_file) {
                case "receipt":
                  item.visa_files = [];
                  break;
                case "EAD":
                  item.visa_files = ["receipt"];
                  break;
                case "I-983":
                  item.visa_files = ["receipt", "EAD"];
                  break;
                case "I-20":
                  item.visa_files = ["receipt", "EAD", "I-983"];
                  break;
                default:
                  item.visa_files = [];
                  break;
              }
            else if (item.visa_status === "approved")
              item.visa_files = ["receipt", "EAD", "I-983", "I-20"];
            else item.visa_status = null;
          }
          return item;
        })
      );
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//visa action
exports.put_visa_file_review = async (req, res) => {
  const { email, visa_status, visa_status_msg } = req.body;
  const nextFileOf = {
    receipt: "EAD",
    EAD: "I-983",
    "I-983": "I-20",
    "I-20": "done",
  };

  try {
    const query = await EmployeeInfo.findOne({ email });
    if (!query) res.status(404).json({ message: "Record was not found!" });
    const curVisaStatus = query.visa_status;
    if (
      !query.visa ||
      query.visa.type !== "F1(CPT/OPT)" ||
      curVisaStatus === "approved"
    )
      res.status(403).json({ message: "no need review!" });
    if (curVisaStatus === "pending") {
      if (visa_status === "rejected") {
        query.visa_status = visa_status;
        query.visa_status_msg = visa_status_msg;
      } else if (visa_status === "approved") {
        query.visa_status = "waiting";
        query.visa_status_msg = "";
        query.next_file = nextFileOf[query.next_file];
        if (query.next_file === "done") query.visa_status = "approved";
      } else res.status(400).json({ message: "illegal new visa status!" });
      await query.save();
      res.status(200).json({ message: "success!" });
    } else res.status(400).json({ message: "Need user action before review!" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
