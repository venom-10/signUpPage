const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require('https');
const { options } = require("request");
const { resolveSoa } = require("dns");

// app.use(express.static(__dirname+"/"))
app.use("/", express.static(__dirname));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res)=>{
  res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members : [
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
  const url = "https://us14.api.mailchimp.com/3.0/lists/871b4e14f1";

  const options = {
    method: "POST",
    auth: "Rohit:746366b2a6a53223e85933aecaee2015-us14"
  };

  const request = https.request(url, options, (resp)=>{
    if(resp.statusCode == 200){
      res.sendFile(__dirname+"/success.html")
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    resp.on("data",(d)=>{
      console.log(JSON.parse(d));
    })
  })
  request.write(jsonData);
  request.end();
})
app.listen(process.env.PORT||3000, ()=>{
  console.log("running on port 3000");
})


app.post("/failure",(req, res)=>{
  res.redirect('/')
})

// api key
// 746366b2a6a53223e85933aecaee2015-us14

// list/audience id
// 871b4e14f1