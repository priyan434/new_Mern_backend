const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const secretkey=process.env.SECRET_KEY


const getAuthToken = require("../utils/genAuthToken");
const { response } = require("express");
const saltRounds = 10;
module.exports.register = async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(6).max(200).required(),
      email: Joi.string().min(3).max(200).email(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    let user = await User.findOne({ email: req.body.email });
  
    if (user) {
      return res.status(400).send("User already exists...");
    }
  
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
  
    user = await user.save();
    const token = getAuthToken(user);
    res.send(token)
  };
  

module.exports.login = async (req, res) => {

    const schema = Joi.object({
        password: Joi.string().min(3).max(200).required(),
        email: Joi.string().min(3).max(200).email(),
      });
    
      const { error } = schema.validate(req.body);
    
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
    
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send("Invalid credentials...");
      }
      const isValid=await bcrypt.compare(req.body.password,user.password);
      if(!isValid){
        return res.status(400).send("Invalid credentials...");
      }
      const token=getAuthToken(user);
      res.send(token);
};

module.exports.reset_email = async (req, res) => {
  const { email } = req.body;
  // console.log(secretkey);
  try {
    let user = await User.findOne({ email: email });

    if (user) {
      const token=jwt.sign({email:user.email,id:user._id},"newsecretkey",{
        expiresIn:"5m"
      });


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'priyanr494@gmail.com',
          pass: 'fiaa qiro ewwf xdgx',
        },
      });

      // Set up the email options
      const mailOptions = {
        from: 'priyanr494@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Link:http://localhost:5173/resetpassword/${user._id}`,
      
      };

      // Send the email
      const result = await transporter.sendMail(mailOptions);

      if (result.accepted) {
        return res.status(200).send('Email sent successfully');
      }
    } else {
      return res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).send('Internal Server Error');
  }
};



module.exports.resetpassword = async (req, res) => {
  const {id,token}=req.params
// console.log(id);
  const { password, cpassword } = req.body;

  if (password !== cpassword) {
    return res.status(400).json({ error: "Password does not match" });
  }

  try {
    let user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const saltRounds = 10; // You need to define saltRounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:hashedPassword});
    setnewuserpass.save();

      return res.status(200).json(setnewuserpass); // Sending back the updated user
    } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



