const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { fakerDE: faker } = require("@faker-js/faker");

const MONGO_URL =
  "mongodb+srv://Yifu:AutogenerateSecurePassword@cluster0.outxpvh.mongodb.net";

const Address = require("../../models/shared_models/Address");
const Person = require("../../models/shared_models/Person");
const Employee = require("../../models/Employee");
const EmployeeInfo = require("../../models/EmployeeInfo");
const Housing = require("../../models/Housing");

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

async function generateFakeData() {
  const email = faker.internet.email();
  const uname = faker.internet.userName().substring(0, 10).replace(/[._]/g, "");
  const fname = faker.person.firstName();
  const lname = faker.person.lastName();
  const phoneNumberType = "##########";

  const employee = {
    uname: uname,
    email: email,
    psw: await bcrypt.hash("Qqwwee123!", Number(10)),
    role: faker.helpers.arrayElement(["normal", "hr"]),
  };

  const employeeInfo = {
    email: email,
    status: faker.helpers.arrayElement(["Not Started", "Rejected", "Pending"]),
    fname: fname,
    lname: lname,
    msg: faker.lorem.sentences(2),
    ssn: faker.number.int({ min: 100000000, max: 999999999 }),
    dob: faker.date.anytime(),
    cur_add: {
      apt: faker.number.int({ min: 1, max: 200 }),
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    },
    cell_phone: faker.phone.number(phoneNumberType),
    work_phone: faker.phone.number(phoneNumberType),
    citizen_status: faker.helpers.arrayElement([
      "Green Card",
      "Citizen",
      "Other",
      "Other",
      "Other",
      "Other",
      "Other",
    ]),
    emergency: [
      {
        fname: faker.person.firstName(),
        lname: faker.person.lastName(),
        phone: faker.phone.number(phoneNumberType),
        email: faker.internet.email(),
        relationship: faker.helpers.arrayElement(["family", "friend", "other"]),
      },
      {
        fname: faker.person.firstName(),
        lname: faker.person.lastName(),
        phone: faker.phone.number(phoneNumberType),
        email: faker.internet.email(),
        relationship: faker.helpers.arrayElement(["family", "friend", "other"]),
      },
    ],
    visa: {
      type: faker.helpers.arrayElement([
        "H1-B",
        "L2",
        "F1(CPT/OPT)",
        "H4",
        "Other",
      ]),
      start: faker.date.future(),
      end: faker.date.future(),
    },
  };

  if (employeeInfo.citizen_status === "Other") {
    employeeInfo.next_file = "receipt";
    employeeInfo.visa_status = "waiting";
    employeeInfo.visa.type = "F1(CPT/OPT)";
  } else {
    employeeInfo.visa_status = null;
    employeeInfo.visa = null;
  }

  const comment_ts1 = faker.date.past();
  const comment_ts2 = new Date(comment_ts1.getTime() + 1000 * 60 * 60 * 24 * 2);
  const comment_ts3 = new Date(comment_ts1.getTime() + 1000 * 60 * 60 * 24);
  const comment_timestamps = [comment_ts1, comment_ts2, comment_ts3];
  const comments = Array.from({ length: 3 }, (_, i) => ({
    desc: faker.lorem.sentences(2),
    created_by: fname + " " + lname,
    ts: comment_timestamps[i],
  }));

  const report_ts1 = faker.date.past();
  const report_ts2 = new Date(report_ts1.getTime() + 1000 * 60 * 60 * 24 * 2);
  const report_ts3 = new Date(report_ts1.getTime() + 1000 * 60 * 60 * 24);
  const report_timestamps = [report_ts1, report_ts2, report_ts3];
  const reports = Array.from({ length: 3 }, (_, i) => ({
    title: faker.lorem.words(5),
    desc: faker.lorem.sentences(3),
    created_by: fname + " " + lname,
    status: faker.helpers.arrayElement(["Open", "In Progress", "Closed"]),
    comments: comments,
    ts: report_timestamps[i],
  }));

  const housing = {
    address: {
      apt: faker.number.int({ min: 1, max: 200 }),
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    },
    tenant: [email],
    landlord: {
      fname: faker.person.firstName(),
      lname: faker.person.lastName(),
      phone: faker.phone.number(phoneNumberType),
      email: faker.internet.email(),
    },
    furniture: {
      beds: faker.number.int({ min: 0, max: 5 }),
      mattresses: faker.number.int({ min: 0, max: 5 }),
      tables: faker.number.int({ min: 0, max: 5 }),
      chairs: faker.number.int({ min: 0, max: 5 }),
    },
    reports: reports,
  };
  return { employee, employeeInfo, housing };
}

async function seedDB() {
  let length = 20;
  try {
    await Employee.deleteMany({});
    await EmployeeInfo.deleteMany({});
    await Housing.deleteMany({});

    const fakeDataPromises = Array.from({ length: length }, () =>
      generateFakeData()
    );

    const fakeDataArray = await Promise.all(fakeDataPromises);

    let tenants = [];

    const promises = fakeDataArray.map(
      ({ employee, employeeInfo, housing }) => {
        return Promise.all([
          Employee.create(employee),
          EmployeeInfo.create(employeeInfo),
        ]).then(([employee, employeeInfo]) => {
          tenants.push(employeeInfo._id);
          housing.tenant = [...tenants]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          return Housing.create(housing);
        });
      }
    );

    await Promise.all(promises);

    console.log("Database seeded!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
