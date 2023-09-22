const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

main().catch((err) => console.error(err));

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
}

module.exports = mongoose;
