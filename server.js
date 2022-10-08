import http from "http";
import { getSanitizingConverter } from "pagedown";
import dotenv from "dotenv";
import { getMailInfo, sendMail, serveFile } from "./utils.js";
import statik from "node-static";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var fileServer = new statik.Server(__dirname);

const app = http.createServer(async (req, res) => {
    let pathToFile = "./views/";

    if (req.url === "/" && req.method === "GET") {
        pathToFile += "index.html";
        serveFile(res, pathToFile)
    } else if (req.url === "/" && req.method === "POST") {
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

    } else if (req.url.startsWith("/public")) {
        req.addListener('end', function () {
            fileServer.serve(req, res, function (err, result) {
                if (err) { // There was an error serving the file
                    console.error(
                        "Error serving " + req.url + " - " + err.message
                    );

                    // Respond to the client
                    res.writeHead(err.status, err.headers);
                    res.end();
                }
            });
        }).resume();
    } else {
        pathToFile += "404.html";
        serveFile(res, pathToFile)
    }


});

app.listen(PORT, () => {
    console.log(`Listening to server at port ${PORT}`)
});
