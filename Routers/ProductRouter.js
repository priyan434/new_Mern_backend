const { getallpro, addproduct, updateproduct, deleteproduct, getSingleProduct } = require("../Controllers/ProductController");

const {isAdmin}=require('../Middleware/auth');

const router = require("express").Router();

router.get("/getallpro", getallpro);
router.post("/addproduct",isAdmin,addproduct)
router.put("/updateproduct",isAdmin, updateproduct);
router.put("/deleteproduct",deleteproduct)
router.get("/getsingleproduct/:id",getSingleProduct)



module.exports = router;