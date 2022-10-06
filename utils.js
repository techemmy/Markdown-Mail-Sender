import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

function getMailInfo(requestObject) {
    return new Promise((resolve, reject) => {
        let mailInfo = []
        requestObject.on('data', chunk => {
            mailInfo.push(chunk);
        })
        requestObject.on('end', () => {
            const parsedMailInfo = JSON.parse(Buffer.concat(mailInfo).toString('utf-8'));
            resolve(parsedMailInfo);
        })
    })
}

function sendMail(sender, to, subject, body, htmlBody) {
    return new Promise((resolve, reject) => {
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account');
                console.error(err);
                return process.exit(1);
            }

            console.log('Credentials obtained, sending message...', sender);

            // NB! Store the account object values somewhere if you want
            // to re-use the same account for future mail deliveries

            // Create a SMTP transporter object
            let transporter = nodemailer.createTransport(
                {
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    },
                    logger: true,
                    allowInternalNetworkInterfaces: false
                },
                {
                    // default message fields

                    // sender info
                    from:  `From - ${sender||to} <${process.env.MAIL_USER}>`,
                }
            );

            // Message object
            let message = {
                // Comma separated list of recipients
                to: to,

                // Subject of the message
                subject: subject + " --- " + Date.now(),

                // plaintext body
                text: body,

                // HTML body
                html: htmlBody,
            };

            transporter.sendMail(message, (error, status) => {
                if (error) {
                    console.log('Error occurred');
                    console.log(error.message);
                    reject({success: false, status: error})
                }

                resolve({success: true, status})
                console.log(nodemailer.getTestMessageUrl(success));

                // only needed when using pooled connections
                transporter.close();
            });
        });
    })
}

export { getMailInfo, sendMail };