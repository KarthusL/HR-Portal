const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const yup = require("yup");
const mime = require("mime");
const { uploadFile, getFile } = require("../../config/s3/s3Service");
const EmployeeInfo = require("../../models/EmployeeInfo");

const filePathDict = {
  profile: "/",
  dl: "/",
  receipt: "/work_authorization/",
  EAD: "/work_authorization/",
  "I-983": "/work_authorization/",
  "I-20": "/work_authorization/",
};

exports.download_document = async (req, res) => {
  console.log("***Starting download_document***");
  try {
    const email = req.email;
    const role = req.role;
    const fileName = req.query.fileName;
    // const fileName = req.body.fileName;
    let targetUserEmail;

    if (role === "hr") {
      targetUserEmail = req.query.targetUserEmail;
      // targetUserEmail = req.body.targetUserEmail;
    } else {
      targetUserEmail = email;
    }
    console.log(fileName, targetUserEmail);
    if (!targetUserEmail || !filePathDict[fileName]) {
      throw new Error("Missing or incorrect required parameters");
    }

    const folderPath = `${targetUserEmail}${filePathDict[fileName]}${fileName}`;
    const { buffer, mimeType } = await getFile(folderPath);
    res.set("Content-Type", mimeType);
    console.log("***File successfully retrieved***");
    if (mimeType.startsWith("image/")) {
      const base64Image = `data:${mimeType};base64,${buffer.toString(
        "base64"
      )}`;
      const extension = mime.getExtension(mimeType);
      const fullFileName = `${fileName}.${extension}`;
      console.log(fullFileName);
      return res
        .status(200)
        .json({ mimeType, file: base64Image, filename: fullFileName });
    } else if (mimeType === "application/pdf") {
      // If the file is a PDF, return it as a Buffer
      // The frontend will need to use a PDF viewer to display it
      res.set("Content-Disposition", `inline; filename=${fileName}.pdf`);
      return res.send(buffer);
    } else {
      // If the file is neither an image nor a PDF, return it as is
      return res.status(200).json({ mimeType, file: buffer });
    }
  } catch (e) {
    console.error(e);
    if (e.errors && e.errors[0])
      return res
        .status(403)
        .json(
          `The server was not able to authenticate the request: ${e.errors[0]}`
        );
    else if (e.keyValue) {
      return res
        .status(403)
        .json(
          `The server was not able to authenticate the request: ${e.keyValue}`
        );
    } else {
      return res.status(500).json({
        message:
          "Something went wrong while downloading the document: " + e.message,
      });
    }
  }
};

exports.upload_documents = async (req, res) => {
  console.log("***starting upload_documents***");
  try {
    const email = req.email;

    const files = req.files.files || req.files;
    console.log(files);
    if (!files || files.length === 0) {
      throw new Error("No files attached with the request.");
    }

    const employee = await EmployeeInfo.findOne({ email: email });

    for (const file of files) {
      const fileName = file.originalname.split(".")[0];
      if (!filePathDict[fileName]) {
        return res.status(415).json({
          message: `Unrecognized file name --- ${fileName}`,
        });
      }

      const folderPath = `${email}${filePathDict[fileName]}${fileName}`;
      const ACL = fileName === "profile" ? "public-read" : "private";
      const fileURL = await uploadFile(folderPath, file, ACL);

      if (fileName === "profile") {
        // Update the 'pic' field with public URL
        employee.pic = fileURL;
      }
      // Update the 'dl' field with private URL
      else if (fileName === "dl") {
        console.log("------------------------------------");
        employee.dl.dl_doc = fileURL;
      }
      // if the next file to be submitted matches the current file name, update the visa status to 'pending'.
      else if (employee.next_file === fileName) {
        employee.visa_status = "pending";
        employee.visa_status_msg = null;
      }
      // if the uploaded file does not match any expected file name, return an error message.
      else {
        return res.status(415).json({
          message: `Wrong file submitted --- ${fileName}`,
        });
      }
    }

    await employee.save();

    console.log("***files successfully uploaded***");
    if (res.locals.newEmployee) {
      return res
        .status(201)
        .json({ message: "User created and file(s) uploaded successfully." });
    }

    return res.status(201).json({ message: "File(s) updated successfully." });
  } catch (e) {
    console.error(e);
    if (e.errors && e.errors[0])
      return res
        .status(403)
        .json(
          `The server was not able to authenticate the request: ${e.errors[0]}`
        );
    else if (e.keyValue) {
      return res
        .status(403)
        .json(
          `The server was not able to authenticate the request: ${e.keyValue}`
        );
    } else {
      return res.status(500).json({
        message:
          "Something went wrong while uploading the documents: " + e.message,
      });
    }
  }
};
