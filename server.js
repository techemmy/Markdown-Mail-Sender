import { createServer } from "http";
import { getSanitizingConverter } from "pagedown";
import fs from "fs";
import dotenv from "dotenv";
import { getMailInfo, sendMail } from "./utils.js";

dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = createServer(async (req, res) => {
    // render html files to response
    let pathToFile = "./views/";
    switch (req.url) {
        case "/":
            pathToFile += "index.html";
            if (req.method === "POST") {
                try {
                    const {mailFrom, mailTo, mailSubject, mailBody} = await getMailInfo(req);
                    const markdownToHTMLConverter = new getSanitizingConverter();
                    const mailBodyInHTML = markdownToHTMLConverter.makeHtml(mailBody)
                    const mailResponse = await sendMail(mailFrom, mailTo, mailSubject, mailBody, mailBodyInHTML);
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(JSON.stringify(mailResponse))
                } catch (error) {
                    res.writeHead(500, {'Content-Type':'application/json'})
                    res.end(JSON.stringify(error))
                }
            }
            break;

        default:
            // load public files
            if (req.url.startsWith("/public")) {
                console.log("ok", `.${req.url}`)
                var file = fs.createReadStream(`.${req.url}`);
                file.pipe(res);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
            }

            pathToFile += "404.html";
            break
    }

    fs.readFile(pathToFile, (err, file) => {
        if (err) {
            console.log(err);
            res.end("An error occured");
        }
        res.end(file);
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Listening to server at http://${HOST}:${PORT}`)
});
