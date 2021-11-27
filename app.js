const express = require("express");
const bodyParser = require("body-parser");
const ejs =  require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/studentDB");

const detailSchema = {
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
};

const adminSchema = {
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
}

const Detail = mongoose.model("detail", detailSchema);

const Admin = mongoose.model("admin", adminSchema);

app.get("/", function(req, res){
  res.render("index");
});


app.get("/records", function(req, res){
  Detail.find({}, function(err, foundDetail){
    if(!err){
      res.render("records", {detail: foundDetail});
    }
  });
});

app.get("/record/:id", function(req, res){
  const id = req.params.id;

  Detail.findById(id, function(err, foundDetail){
    if(!err){
      res.render("record", {detail: foundDetail});
    }
  });
});

app.get("/admin", function(req, res){
  res.render("admin");
});

app.post("/admin", function(req, res){
  console.log(req.body);
});

app.post("/sign-up", function(req, res){

  bcrypt.hash( req.body.password, saltRound, function(err, hash){
    const detail = new Detail({
      name: req.body.name,
      email: req.body.email,
      password:  hash,
      DOB: req.body.date,
      phone: req.body.number
    });

   detail.save(function(err){
    if(!err){
      console.log("Successfully success....");
    }

    res.redirect("/records");
    });
  });
});

app.post("/login", function(req, res){

  Detail.findOne({email: req.body.email}, function(err, detail){
    bcrypt.compare(req.body.password, detail.password, function(err, result){
      if(result === true){
        res.redirect(`/record/${detail._id}`);
      }
    });
  });
});

app.listen("3000", function(){
  console.log("This is port 3000....");
});