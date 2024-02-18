const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      minlength:3,
      maxlength: 300,
    },
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:200,

    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:1024,
    },

    isAdmin:{
      type:Boolean,
      default:false
    },
   
  
  },{timestamps:true});
  
  module.exports = mongoose.model("users", userSchema);