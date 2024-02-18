const { checkout } = require("../Controllers/StripeController");
const nodemailer = require('nodemailer');
const { jsPDF } = require("jspdf"); // will automatically load the node version
const router = require("express").Router();
const Order=require("../Models/OrderModel")
router.post("/create-checkout-session", checkout);

const stripe = require("stripe")(
  process.env.STRIPE_KEY
);
const express=require("express");

var endpointSecret ;
// endpointSecret = "whsec_c7b2d8b8745b2e2006ff686776224f8387620616384cf5c96e8d9129957ff061";

const createOder=async(customer,data,lineItems)=>{
 
  const newOrder=new Order({
    userId:customer.metadata.userId,
    customerId:data.customer,
    paymentIntentId:data.payment_intent,
    products:lineItems.data,
    subtotal:data.amount_subtotal,
    total:data.amount_total,
   shipping:data.customer_details,
   payment_status:data.payment_status,
  })
  try{
    const saveorder=await newOrder.save();
    // console.log("processed order",saveorder);
// console.log(customer.email);

const doc = new jsPDF();


doc.text(
  "Your Order details\n\n" +
  "Your email: " + customer.email.toString() + "\n\n" +
  "Your id: " + saveorder.userId.toString() + "\n\n" +
  "Payment Id: " + saveorder.paymentIntentId.toString() + "\n\n" +
  "Total amount: " + (saveorder.total / 100).toString() + "\n\n" +
  "Delivery_status: " + saveorder.delivery_status.toString() + "\n\n" +
  "Payment_status: " + saveorder.payment_status.toString(),
  10,
  20
);
doc.save("a4.pdf");

const pdfBuffer = doc.output();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'priyanr494@gmail.com',
    pass: 'fiaa qiro ewwf xdgx',
  },
});


const cust_email=customer.email
console.log("cust_email",cust_email);
const mailOptions = {
  from: 'priyanr494@gmail.com',    // Replace with your email
  to: cust_email,
  subject: 'Order Details',
  text: 'Attached is your order details.',
  attachments: [
    {
      filename: 'order_details.pdf',
      content: Buffer.from(pdfBuffer).toString('base64'),
      encoding: 'base64',
      contentType: 'application/pdf',
    },
  ],
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});

  }
  catch(err){
    console.log(err);
  }
  }
  



router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
 
  let data;
  let eventType;
  if(endpointSecret){
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("verified");
  
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data=event.data.object;
    eventType=event.type;
  }
  else{
    data=req.body.data.object;
    // console.log(data);
    eventType=req.body.type;
  }

if(eventType==='checkout.session.completed'){
  // const customer = await stripe.customers.retrieve(
  //   'cus_9s6XKzkNRiz8i3'
  // );

  stripe.customers.retrieve(data?.customer).then((customer)=>
  {
    // console.log("customer::",customer.email);
    stripe.checkout.sessions.listLineItems(
      data.id,
      {  },
      function(err, lineItems) {
        createOder(customer,data,lineItems)
        // console.log(customer.email);
        
      }
    );
    

  }
  ).catch((err)=>console.log(err))
}

  res.send();
});




module.exports = router;
