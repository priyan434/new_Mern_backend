const {
    register, login,
    resetpassword,
    reset_email,
  } = require("../Controllers/UserController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.post("/reset_email", reset_email);
  router.post("/resetpassword/:id", resetpassword);


  
  module.exports = router;