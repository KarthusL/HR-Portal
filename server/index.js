const app = require("./server");
const dbconnection = require("./config/db/db");
const s3Connection = require("./config/s3/s3Connection");
const port = process.env.PORT || 3000;

(async () => {
  try {
    dbconnection.connection;
    await s3Connection();
    app.listen(port, () => {
      console.log(`Server running on port ${port}!`);
    });
  } catch (err) {
    console.error(err);
  }
})();
