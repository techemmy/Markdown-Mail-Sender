import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

function getMailInfo(requestObject) {
  return new Promise((resolve, reject) => {
    let mailInfo = [];
    requestObject.on("data", (chunk) => {
      mailInfo.push(chunk);
    });
    requestObject.on("end", () => {
      const parsedMailInfo = JSON.parse(
        Buffer.concat(mailInfo).toString("utf-8")
      );
      resolve(parsedMailInfo);
    });
    requestObject.on("error", (error) => {
      reject(error);
    });
  });
}

function sendMail(sender, to, subject, body, htmlBody, senderEmail, senderPassword) {
  return new Promise(async (resolve, reject) => {

    let transporter = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER, // senderEmail
          pass: process.env.MAIL_PASS, // senderPassword
        },
        secure: false,
        logger: true,
        allowInternalNetworkInterfaces: false,
      },
      {
        // sender info
        from: `${sender || to} <${process.env.MAIL_USER}>`,
      }
    );

    // Message object
    let message = {
      // Comma separated list of recipients
      to: to,

      // Subject of the message
      subject: subject,

      // plaintext body
      text: body,

      // HTML body
      html: htmlBody,
    };

    transporter.sendMail(message, (error, status) => {
      if (error) {
        console.log("Error occurred");
        console.log(error.message);
        reject({ success: false, status: error });
      }

      resolve({ success: true, status });
      console.log(nodemailer.getTestMessageUrl(status));
    });
  });
}

function serveFile(res, pathToFile) {
  fs.readFile(pathToFile, (err, file) => {
    if (err) {
      console.log(err);
      res.end("An error occured");
    }
    res.end(file);
  });
}

export { getMailInfo, sendMail, serveFile };
