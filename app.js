require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express ();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// Listening port
app.listen(3000, function(){
    console.log("Server running running on port 3000!");
});

// Connecting to the mongodb local server
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

// Create users sschema with Database encryption adding desired fields to be
// encrypted
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// Read out the secret key from the .env file
// console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});


// Create collection in the DB
const User = new mongoose.model("User", userSchema);


///////// Get routes /////////

app.get("/", function(req, res){
    res.render('home');
});

app.get("/login", function(req, res){
    res.render('login');
});

app.get("/register", function(req, res){
    res.render('register');
});


///////// Post routes /////////
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if (err){
            res.send(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const  userName = req.body.username;
    const passWord = req.body.password;

    User.findOne({email: userName}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if (foundUser){
                if (foundUser.password === passWord){
                    res.render("secrets");
                }
            }
        }
    });
});