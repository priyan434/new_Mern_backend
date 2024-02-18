const mongoose=require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema({
id:{
  type:Number,
},
  name:{
    type:String,
 
  },
  price:{
    type:Number,
   
  },
  description:{
    type:String,
    
  },
  category:{
    type:String
  },
  imageSrc:{
    type:Object,
  },
  rating:{
    type:Number,
  },
  stock:{
    type:Number
  }
  },{timestamps:true});

 const ProductsModel=mongoose.model('products',ProductSchema);

module.exports=ProductsModel;
// {"id":1,"name":"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops","price":109.95,"description":"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday","category":"men's clothing","imageSrc":"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","rating":3.9,"stock":120}