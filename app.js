//jshint esversion: 6

//require and use express, bodyParser, request, https
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//get request functino made by client server
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//post request function sent back to client server
app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us10.api.mailchimp.com/3.0/lists/6192e72125";

    const options = {
        method: "POST",
        auth: "Jesus1:b3b9fd4a2fd277250fee3f41c7c16d46-us10"

    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();  

});

//case: if there was an issue, send to failure.html
app.post("/failure", function(req, res) {
    res.redirect("/")
})


//listen to port 3000 OR through Heroku server
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});
