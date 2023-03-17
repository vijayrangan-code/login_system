// creating server 
const express = require("express");// connect server
const mysql = require("mysql");// connect a mysql server
const dotenv = require("dotenv"); //handling username and password
const path = require('path');//for choosing html files
const hbs = require("hbs"); // for handling HTML templates
const cookieParser = require("cookie-parser");

const app = express();

// for saving users sensitive data
dotenv.config({
    path:'./.env'
})


// create mysql connection step - 3
const db = mysql.createConnection({
    // host:'localhost',
    // user:'root',
    // password:'vijay',
    // database:'login_crud',
    host:process.env.DATABASE_HOST,// step 5
    user:process.env.DATABASE_USER,// step 5
    password:process.env.DATABASE_PASS,// step 5
    database:process.env.DATABASE,// step 5

});
// checking my sqlconnection connected or not step-4
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("mysql connection success");
    }
});
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


//for accesing style.css files and images -- step 6
const location = path.join(__dirname,'./public')
app.use(express.static(location));
//setting hbs to server step - 7
app.set("view engine","hbs");

const partialspath = path.join(__dirname,"./views/partials")
hbs.registerPartials(partialspath);




app.use('/',require("./routes/pages"))
app.use("/auth", require("./routes/auth"));

// crating a port step - 2
app.listen(3000,() => {
    console.log("server started");
});

