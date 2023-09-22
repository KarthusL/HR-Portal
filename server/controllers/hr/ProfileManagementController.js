const EmployeeInfo = require("../../models/EmployeeInfo");

//get all user summary review with search
exports.get_employees = async (req, res) => {
  const { identifier, val } = req.query;

  try {
    if (identifier) {
      if (val) {
        const query = await EmployeeInfo.find(
          { [`${identifier}`]: { $regex: val, $options: "i" } },
          "fname mname lname pname ssn citizen_status visa.type cell_phone email"
        ).sort("lname");
        res.status(200).json(query);
      }
    } else {
      const query = await EmployeeInfo.find(
        {},
        "fname mname lname ssn citizen_status visa cell_phone email"
      ).sort("lname");
      res.status(200).json(query);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
