const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

//for login page
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        msg: "please enter your Email and Password",
        msg_type: "error",
      });
    }
    db.query(
      "select * from users where email=?",
      [email],
      async (error, result) => {
        console.log(result);
        if (result.length <= 0) {
          return res.status(401).render("login", {
            msg: "please enter your Email and Password",
            msg_type: "error",
          });
        } else {
          if (!(await bcrypt.compare(password, result[0].PASS))) {
            return res.status(401).render("login", {
              msg: "please enter your Email and Password",
              msg_type: "error",
            });
          } else {
            const ID = result[0].ID;
            const token = jwt.sign({ id: ID }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            console.log("The Token is " + token);
            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("vijay", token, cookieOptions);
            res.status(200).redirect("/home");
          }
        }
      }
    );
  } catch {
    console.log(error);
  }
};

// for registration page///////
exports.register = (req, res) => {
  console.log(req.body);
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  // console.log("submitted");
  db.query(
    "select email from users where email=?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result.length > 0) {
        return res.render("register", {
          msg: "Email id already taken",
          msg_type: "error",
        });
      } else if (password !== confirm_password) {
        return res.render("register", {
          msg: "Password do not match",
          msg_type: "error",
        });
      }
      let hashedpassword = await bcrypt.hash(password, 8);
      // console.log(hashedpassword);

      db.query(
        "insert into users set ?",
        { name: fullname, email: email, pass: hashedpassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
            return res.render("register", {
              msg: "user registration success",
              msg_type: "good",
            });
          }
        }
      );
    }
  );
};

exports.isLoggedIn = async (req, res, next) => {
    //   req.name = "check Login...";
    //   next();
  // console.log(req.cookies);
  if(req.cookies.vijay){
    const decode = await promisify(jwt.verify)(
        req.cookies.vijay,
        process.env.JWT_SECRET
    );
    console.log(decode);
db.query("select * from users where id = ?",[decode.id],(err,results)=>{
    if(!results){
        return next();
    }
    req.user = results[0];
    return next();
    // console.log(results);
})
  }else{
    next();
  }
  
};

exports.logout = async(req,res)=>{
  res.cookie("vijay","logout",{
    expires: new Date (Date.now() +2 * 1000),
    httpOnly:true,
  });
  res.status(200).redirect("/");

}
