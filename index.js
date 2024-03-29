const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

const {config }= require(__dirname+"/config.js");

const apiKey = config.api_Key;
const listId = config.list_Id;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extented: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/"+listId;

  const options = {
    method: "POST",
    auth: "Ashna1:"+apiKey
  }

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure.html",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});
