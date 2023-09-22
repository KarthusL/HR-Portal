const Housing = require("../../models/Housing");

//post new house
exports.post_new_house = async (req, res) => {
  const { address, landlord, furniture } = req.body;

  try {
    await Housing.create({
      address,
      tenant: [],
      reports: [],
      landlord,
      furniture,
    });
    res.status(201).json({ message: "created!" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//get all house
exports.get_all_houses = async (req, res) => {
  const { curPage, itemPerPage, reports_order, comments_order } = req.query;
  const reports_orderParam = reports_order
    ? reports_order === "descending"
      ? -1
      : 1
    : 0;
  const comments_orderParam = comments_order
    ? comments_order === "descending"
      ? -1
      : 1
    : 0;

  try {
    const houseList = await Housing.find({})
      .populate("tenant", "fname mname lname pname cell_phone email")
      .populate({
        path: "reports",
        populate: {
          path: "comments",
        },
      });
    if (!houseList || !houseList.length) res.status(204).send();
    for (let house of houseList) {
      reports_orderParam &&
        house.reports.sort((a, b) =>
          reports_orderParam > 0
            ? a.ts.getTime() - b.ts.getTime()
            : b.ts.getTime() - a.ts.getTime()
        );
      for (let report of house.reports)
        comments_orderParam &&
          report.comments.sort((a, b) =>
            comments_orderParam > 0
              ? a.ts.getTime() - b.ts.getTime()
              : b.ts.getTime() - a.ts.getTime()
          );
    }
    if (curPage > 0 && itemPerPage > 0) {
      const totalPages = Math.ceil(houseList.length / itemPerPage);
      if (totalPages > 1)
        res.status(200).json({
          totalPages,
          houseList: houseList.slice(
            (curPage - 1) * itemPerPage,
            curPage * itemPerPage
          ),
        });
      else res.status(200).json(houseList);
    } else res.status(200).json(houseList);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//delete house
exports.delete_house_by_id = async (req, res) => {
  const { house_id } = req.query;

  try {
    const deletedHosue = await Housing.findByIdAndDelete(house_id);
    if (deletedHosue) res.status(200).json({ message: "Delete successful!" });
    else res.status(404).json({ message: "No record has been found!" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//update house report status
exports.put_report_status_by_id = async (req, res) => {
  const { housing_id, report_id, status } = req.body;

  try {
    const house = await Housing.findById(housing_id);
    if (!house) {
      return res.status(404).json({ message: "Housing not found" });
    }
    const report = house?.reports?.id(report_id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    report.status = status;
    await house.save();
    return res.status(200).json({ message: "Report status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
