const jwt = require("jsonwebtoken");

const { JWT_KEY } = process.env;

const Employee = require("../../models/Employee");
const EmployeeInfo = require("../../models/EmployeeInfo");
const Registration = require("../../models/Registration");

exports.get_new_employee_list = async (_req, res) => {
  try {
    const query = await Registration.find({}, "email name status");
    if (!query || !query.length) res.status(204).send();
    res.status(200).send(query);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//get registration link for new employee
exports.post_employee_email = async (req, res) => {
  const { email, name } = req.body;

  try {
    const hasReg = await Employee.findOne({ email });
    if (hasReg)
      res.status(400).json({ message: "This user already has account." });
    const token = jwt.sign({ email }, JWT_KEY, { expiresIn: "3h" });
    const registrationLink = `http://localhost:3000/api/auth/signup?token=${token}`;
    //this use to handle the situation if hr need to resend the link to user
    await Registration.findOneAndDelete({ email });
    await Registration.create({
      email,
      name: name ? name : "Employee",
      link: registrationLink,
      status: "sent",
    });
    res.status(200).json({ registrationLink });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//get onboarding list preview
exports.get_onboarding_info = async (req, res) => {
  const { status_filter, curPage, itemPerPage } = req.query;

  const condition = {};
  let attrs = "";
  if (status_filter) {
    condition.status = status_filter;
    attrs = "fname mname lname email";
  } else attrs = "fname mname lname email status";

  try {
    const query = await EmployeeInfo.find(condition, attrs);
    if (!query) res.status(204).send();
    if (itemPerPage > 0) {
      const totalPages = Math.ceil(query.length / itemPerPage);
      if (totalPages > 1) {
        res.status(200).json({
          totalPages,
          EmployeeInfoList: query.slice(
            (curPage - 1) * itemPerPage,
            curPage * itemPerPage
          ),
        });
      } else res.status(200).json(query);
    } else res.status(200).json(query);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//onboarding application review
exports.put_onboarding_review = async (req, res) => {
  const { email, status, msg } = req.body;

  try {
    const query = await EmployeeInfo.findOne({ email });
    if (!query) res.send(404).json({ message: "Onboarding info not found!" });
    if (query.status !== "Pending")
      res.send(403).json({ message: "Already Approved or Rejected before!" });
    query.status = status;
    if (status === "Rejected") {
      query.msg = msg;
      await query.save();
      res.status(200).json({ message: `Rejected with reason: ${msg}` });
    } else if (status === "Approved") {
      query.visa_status = "waiting";
      query.next_file = "EAD";
      await query.save();
      res.status(200).json({ message: `Approved!` });
    } else res.status(400).json({ message: "Bad status!" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
