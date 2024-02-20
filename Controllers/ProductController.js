
require('dotenv').config()

const Product = require("../Models/ProductModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhepy11yc",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.getallpro = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length > 0) {
      res.status(200).json(products); 
    } else {
      res.status(404).json({ message: "No products found" }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  const {id}=req.params
  const secretkey=process.env.SECRET_KEY
  try {
    const singleproduct = await Product.findOne({ id: id });
    // console.log(singleproduct);
    if (singleproduct) {
      res.status(200).json(singleproduct);
    } else {
      res.status(404).json({ message: "No product found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" }); 
  }
};

module.exports.updateproduct = async (req, res) => {
  const { name, id, description, price, imageSrc, stock, rating, category } =
    req.body;

  try {
    if (!req.body.id) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    if (!imageSrc) {
      return res.status(400).json({ error: "Image source is required" });
    }

    const result = await cloudinary.uploader.upload(imageSrc);
    // console.log(result);
    const product = await Product.findOne({ id: req.body.id });
  console.log(result.url);
    if (product) {
      const doc = await Product.findByIdAndUpdate(
        product._id,
        {
          id,
          name,
          price,
          rating,
          description,
          stock,
          category,
          imageSrc: result.url || "",
        },
        { new: true }
      );
      if (doc) {
        return res.json(doc);
      } else {
        return res.status(500).json({ error: "Error while updating" });
      }
    } else {
      return res.status(404).json({ error: "error while upadting" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.addproduct = async (req, res) => {

  const { name, id, description, price, imageSrc, stock, rating, category } =
    req.body;

  try {
    // Check if image source is provided
    if (!imageSrc) {
      return res.status(400).json({ error: "Image source is required" });
    }

    const result = await cloudinary.uploader.upload(imageSrc);
    // console.log(result);

    if (result) {
      const product = new Product({
        id,
        name,
        price,
        description,
        category,
        imageSrc: result.url,
        rating,
        stock,
      });

      const savedProduct = await product.save();
      res.status(200).json("ok");
    }
  } catch (error) {
    console.error("Error in addproduct:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.deleteproduct = async (req, res) => {
  const id = req.body.id; // Assuming the product id is passed as a parameter

  try {
    const product = await Product.findOne({ id: id });
    console.log(product);
    if (product) {
      console.log(product);
      const deletedProduct = await Product.findOneAndDelete({
        _id: product._id,
      });
      if (deletedProduct) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "No product found" });
      }
    } else {
      console.log("product doesnt exist");
    }

  
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
