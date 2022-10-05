import { createServer } from "http";
import { getSanitizingConverter } from "pagedown";
import fs from "fs";
import dotenv from "dotenv";
import { getMailInfo } from "./utils.js";

dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = createServer(async (req, res) => {

    // load public files
    if (req.url.startsWith("/public")) {
        console.log("ok", `.${req.url}`)
        var file = fs.createReadStream(`.${req.url}`);
        file.pipe(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
    }

    // render html files to response
    let pathToFile = "./views/";
    switch (req.url) {
        case "/":
            pathToFile += "index.html";
            if (req.method === "POST") {
                const {mailTo, mailSubject, mailContent} = await getMailInfo(req);
                console.log(mailTo, mailSubject, mailContent);
            }
            break;

        default:
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
