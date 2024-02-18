const moment = require("moment/moment");
const user = require("../models/UserModel");
const order = require("../Models/OrderModel");

module.exports.user = async (req, res) => {
  try {
    const previousMonth = moment().subtract(7, 'months').startOf('month').format("YYYY-MM-DD HH:mm:ss");

    
    const result = await user.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
if(result.length>0){
    res.status(200).send(result);
}
   else{
    res.status(400).send("error fetching data");
   }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.orders = async (req, res) => {
    try {
      const previousMonth = moment().subtract(7, 'months').startOf('month').format("YYYY-MM-DD HH:mm:ss");
  
      
      const result = await order.aggregate([
        {
          $match: { createdAt: { $gte: new Date(previousMonth) } },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
  if(result.length>0){
      res.status(200).send(result);
  }
     else{
      res.status(400).send("error fetching data");
     }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };
module.exports.Earnings = async (req, res) => {
    try {
      const previousMonth = moment().subtract(7, 'months').startOf('month').format("YYYY-MM-DD HH:mm:ss");
  
      
      const result = await order.aggregate([
        {
          $match: { createdAt: { $gte: new Date(previousMonth) } },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales:"$total"
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
  if(result.length>0){
      res.status(200).send(result);
  }
     else{
      res.status(400).send("error fetching data");
     }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };



module.exports.WeekEarnings = async (req, res) => {
  try {
    const last7Days = moment().subtract(7, 'days');
  
    const result = await order.aggregate([
      {
        $match: { createdAt: { $gte: new Date("2023-01-01T00:00:00.000Z") } }
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total"
        }
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" }
        }
      },
   
    ]);
    // console.log(result);

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send("error fetching data");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};



  module.exports.recentTranscations=async(req,res)=>{
    try {
      const result=await order.find().sort({_id:-1}).limit(4);
      if(result){
        res.status(200).send(result);
  
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  
  }