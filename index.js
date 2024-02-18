const express = require('express');
const cors = require('cors');
const app = express();

const nodemailer = require('nodemailer');
const Products = require('./Products');
const userRouter = require('./Routers/UserRouter');
const productRouter=require("./Routers/ProductRouter")
const StripeRouter=require("./Routers/StripeRouter")
const StatsRouter=require("./Routers/StatsRouter")
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with the actual origin of your frontend app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and session data to be shared between the frontend and backend
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '35mb'}));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);
require('dotenv').config();
const mongoose = require('mongoose');
// app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5173';
const stripe = require('stripe')('sk_test_51N6wHZSEfojLwnjiNxL9IH5fNjgfepuFb4dQlJmGHKJezKAHrnqQcQfNgEav3DctA3PS6o81Q81n4VAcWuuRYzSQ00RBFlnUHh');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database connected successfully");
})
.catch((error) => {
  console.error("Error connecting to the database:", error);
  // Handle the error gracefully, you can choose to exit the application or perform other actions as needed
});

app.use(express.json());
app.use(cors(corsOptions));

// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use('/api/user', userRouter);
app.use('/api/products',productRouter)
app.use('/api/stripe',StripeRouter)
app.use('/api/stats',StatsRouter)
app.get('/products', (req, res) => {
  res.send(Products);
});

app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
 const {email}=req.body
//  console.log("data recieved::"+(email));
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
    to:email,
    subject: 'New Form Submission',
    text: `Name: ${'priyan'}\nMessage: ${"welcome!! we'll keep you updated"}`,
  };

  try {
    // Send the email
    const result=await transporter.sendMail(mailOptions);
if(result.accepted){
  res.status(200).send('Email sent successfully');
}
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});



 
 
 app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
 });
