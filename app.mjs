import express from "express";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }))
import request from "request";
import https from "https";

import { fileURLToPath } from 'url';
import { dirname } from "path";
import { stringify } from "querystring";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})
app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const Email = req.body.Email;

    var data = {
        members: [
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/ec4ac92a34"
    const options = {
        method: "POST",
        auth: "Authorization:efb98f36f4b45b0407413cc1ce2d2b99-us21"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData);
    request.end();
})
app.post("/failure", function (req, res) {
    res.redirect("/")
})

app.listen(3000, function () {
    console.log("Server started on port 3000")
})

//  API key
//  efb98f36f4b45b0407413cc1ce2d2b99-us21
// List ID
// ec4ac92a34