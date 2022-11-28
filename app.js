const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const phone = req.body.phone;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  let options = {
    method: "POST",
    auth: process.env.USERNAME_API,
  };
  const url =
    "https://us14.api.mailchimp.com/3.0/lists/" + process.env.LINKED_ID;
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    
  });

  request.write(jsonData);
  request.end();
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 ...");
});
