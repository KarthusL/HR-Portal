const Housing = require("../../models/Housing");
const EmployeeInfo = require("../../models/EmployeeInfo");
const Employee = require("../../models/Employee");

exports.employee_house = async (req, res) => {
  console.log("***employee_house***");
  try {
    const email = req.email;
    console.log(email);

    const employee = await EmployeeInfo.findOne({ email: email });

    if (!employee) {
      return res.status(404).json({ error: "No employee found" });
    }

    const housing = await Housing.findOne({
      tenant: { $in: [employee._id] },
    }).populate("tenant", "fname lname cell_phone");
    // .populate({
    //   path: "reports",
    //   match: { created_by: employee.fname + " " + employee.lname },
    //   options: { sort: { ts: -1 } },
    //   populate: {
    //     path: "comments",
    //     options: { sort: { ts: -1 } },
    //   },
    // })
    // .exec();
    if (!housing) {
      return res.status(404).json({ error: "No housing found" });
    }

    for (let report of housing.reports) {
      report.comments.sort((a, b) => b.ts.getTime() - a.ts.getTime()); // Sort in descending order
    }
    // Sort the reports array
    housing.reports.sort((a, b) => b.ts.getTime() - a.ts.getTime()); // Sort in descending order

    const employeeFullName = `${employee.fname} ${employee.lname}`;
    // Filter reports
    housing.reports = housing.reports.filter(
      (report) => report.created_by === employeeFullName
    );

    if (!housing) {
      return res.status(404).json({ error: "No housing found" });
    }

    console.log("***ending employee_house***");
    return res.status(200).json(housing);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

exports.create_fac_report = async (req, res) => {
  console.log("***starting_create_fac_report***");
  try {
    const email = req.email;
    const { title, desc, ts } = req.body;

    const employee = await EmployeeInfo.findOne({ email: email });

    if (!employee) {
      return res.status(404).json({ error: "No employee found" });
    }

    const housing = await Housing.findOne({
      tenant: { $in: [employee._id] },
    });

    if (!housing) {
      return res.status(404).json({ error: "No housing found" });
    }

    const employeeFullName = `${employee.fname} ${employee.lname}`;

    // Create new report
    const newReport = {
      title: title,
      desc: desc,
      created_by: employeeFullName,
      ts: ts,
      status: "Open",
      comments: [],
    };

    // Add the new report to the housing's reports array
    housing.reports.push(newReport);

    // Save the updated housing document
    await housing.save();
    console.log("***ending_create_fac_report***");
    return res.status(200).json({
      message: "New facility report added successfully",
      report: newReport,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

exports.add_comment_to_report = async (req, res) => {
  console.log("***starting add_comment_to_report***");
  try {
    const email = req.email;
    const { houseId, reportId, desc, ts } = req.body;
    const role = req.role;
    let FullNameOrUname, employee, report, housing;

    if (role === "hr") {
      await Employee.findOne({ email: email }).then((employee) => {
        FullNameOrUname = `${employee.uname}`;
      });
      housing = await Housing.findById(houseId);
    } else {
      employee = await EmployeeInfo.findOne({ email: email });

      if (!employee) {
        return res.status(404).json({ error: "No employee found" });
      }

      housing = await Housing.findOne({
        tenant: { $in: [employee._id] },
      });

      FullNameOrUname = `${employee.fname} ${employee.lname}`;
    }

    if (!housing) {
      return res.status(404).json({ error: "No housing found" });
    }
    report = housing.reports.id(reportId);

    if (!report) {
      return res.status(404).json({ error: "No report found" });
    }

    // Create new comment
    const newComment = {
      desc: desc,
      created_by: FullNameOrUname,
      ts: ts,
    };

    // Add the new comment to the report's comments array
    report.comments.push(newComment);

    // Save the updated housing document
    await housing.save();
    console.log("***ending add_comment_to_report***");
    return res
      .status(200)
      .json({ message: "New comment added successfully", comment: newComment });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

exports.update_comment_on_report = async (req, res) => {
  console.log("***starting update_comment_on_report***");
  try {
    const email = req.email;
    const { houseId, reportId, commentId, desc } = req.body;
    const role = req.role;
    let FullNameOrUname, employee, report, housing;

    if (role === "hr") {
      await Employee.findOne({ email: email }).then((employee) => {
        FullNameOrUname = `${employee.uname}`;
      });
      housing = await Housing.findById(houseId);
    } else {
      employee = await EmployeeInfo.findOne({ email: email });

      if (!employee) {
        return res.status(404).json({ error: "No employee found" });
      }

      housing = await Housing.findOne({
        tenant: { $in: [employee._id] },
      });

      FullNameOrUname = `${employee.fname} ${employee.lname}`;
    }

    if (!housing) {
      return res.status(404).json({ error: "No housing found" });
    }

    report = housing.reports.id(reportId);

    if (!report) {
      return res.status(404).json({ error: "No report found" });
    }

    // Find the comment to be updated
    const comment = report.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "No comment found" });
    }

    // Only allow the comment's author to update the comment
    if (comment.created_by !== FullNameOrUname) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this comment" });
    }

    // Update the comment's description
    comment.desc = desc;

    // Save the updated housing document
    await housing.save();
    console.log("***ending update_comment_on_report***");
    return res
      .status(200)
      .json({ message: "Comment updated successfully", comment: comment });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
