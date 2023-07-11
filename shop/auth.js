const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sha1 = require("sha1");

const administratorLogin = require("../middleware/administratorLogin");
const {
  getUserLogin,
  getUsers,
  insertUserData,
} = require("../schema/project.model");

require("dotenv").config();
router.use(express.json());
const cors = require("cors");
router.use(cors());

const moment = require("moment-timezone");
moment().tz("Asia/Calcutta").format();
process.env.TZ = "Asia/Calcutta";

const JWT_KEYS = process.env.JWT_KEYS;
const PSALTKEY = process.env.PSALTKEY;

///////////////////////////For LOGIN//////////////////////////////////////////////////////

router.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  let concatPassword = PSALTKEY.concat(password);
  let hashedPassword = sha1(concatPassword);

  const userData1 = await getUserLogin(email, hashedPassword);
  let userData = userData1[0];

  if (!userData) {
    return res
      .status(400)
      .json({ statuscode: 0, message: "Invalid UserName or Password" });
  } else {
    if (userData.status === 1) {
      return res.json({ statuscode: 0, message: "This user is not active" });
    }

    if (userData.user_password === hashedPassword) {
      var emailid = userData.user_email;
      var datetime = moment().format("DD MMM YYYY, hh:mm A");
      const token = jwt.sign({ email: emailid }, JWT_KEYS);
      info = {
        statuscode: 1,
        message: "login successfully",
        token: token,
      };
      console.log(
        "Login successfully",
        userData.user_email,
        userData.first_name,
        datetime
      );
      res.json(info);
    } else {
      return res
        .status(400)
        .json({ statuscode: 0, message: "Wrong Password, Please Try again" });
    }
  }
});

////////////////////For SIGN UP(NEW USER)///////////////////////////////////////////////

router.post("/signup", async (req, res) => {
  let { firstName, lastName, email, password, confirmpassword } = req.body;
  var datetime = moment().format("YYYY-MM-DD, HH:mm:ss");

  if (
    firstName.length == "" ||
    firstName.length == null ||
    firstName.length == undefined 
    
  ) {
    return res.status(400).json({ statuscode: 0, message: "first Name Should not be blank" });
  } 
  else if (!validateFName(firstName)) {
    return res.status(400).json({ statuscode: 0, message: "Oops! Looks like your first name contains invalid characters or numbers. Please use letters only." });
  }
 
  
  else if (
    lastName.length == "" ||
    lastName.length == null ||
    lastName.length == undefined 
   
  ) {
    return res.status(400).json({ statuscode: 0, message: "last Name Should not be blank" });
  } else if (!validateLName(lastName)) {
    return res.status(400).json({ statuscode: 0, message: "Oops! Looks like your Last name contains invalid characters or numbers. Please use letters only." });
  }
  else if (
    email.length == "" ||
    email.length == null ||
    email.length == undefined 
    
  ) {
    return res
      .status(400)
      .json({ statuscode: 0, message: "Email Should not be blank" });
  } else if (!validateEmail(email)) {
    return res.status(400).json({ statuscode: 0, message: "Invalid email format!" });
  }
  
  else if (
    password.length == "" ||
    password.length == null ||
    password.length == undefined 
    
  ) {
    return res.status(400).json({
      statuscode: 0,
      message: "Password Should not be blank",
    });
  } else if (!validatePassword(password)) {
    return res.status(400).json({ statuscode: 0, message: "Your password is weak! Utilize uppercase, lowercase, numbers, and special characters for increased security." });
  }
  
  
  else if (
    confirmpassword.length == "" ||
    confirmpassword.length == null ||
    confirmpassword.length == undefined
  ) {
    return res
      .status(400)
      .json({ statuscode: 0, message: "confirm Password Should not be blank" });
  }
  const userData1 = await getUsers(email);
  var userData = userData1[0];

  function validateFName(firstName) {
    // Name should only contain uppercase and lowercase letters
    var namePattern = /^[a-zA-Z]+$/;
    return namePattern.test(firstName);
  }
  function validateLName(lastName) {
    // Name should only contain uppercase and lowercase letters
    var namePattern = /^[a-zA-Z]+$/;
    return namePattern.test(lastName);
  }
  function validateEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  function validatePassword(password) {
    // Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
  let concatPassword = PSALTKEY.concat(password);
  let hashedPassword = sha1(concatPassword);

  if (password === confirmpassword) {
    await insertUserData(firstName, lastName, email, hashedPassword, datetime);
    let info = {
      statuscode: 1,
      message: `Congratulations ${firstName}! Your account has been created successfully. Welcome to Ritualist!`,
    };
    res.json(info);
  } else {
    return res.status(400).json({
      statuscode: 0,
      message:
        "Oops! Your password and its confirmation doesn't matched. Let's try again!",
    });
  }
});

router.get("/", administratorLogin, (req, res) => {
  res.json(req.user);
});

module.exports = router;
