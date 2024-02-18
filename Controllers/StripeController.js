const stripe = require('stripe')('sk_test_51N6wHZSEfojLwnjiNxL9IH5fNjgfepuFb4dQlJmGHKJezKAHrnqQcQfNgEav3DctA3PS6o81Q81n4VAcWuuRYzSQ00RBFlnUHh');
const YOUR_DOMAIN = 'http://localhost:5173';

module.exports.checkout = async (req, res) => {
  
  try {
    const customer=await stripe.customers.create({
      metadata:{
        userId:req.body.userId,
       
      },
     

    })
    // console.log("customer:",customer);
    const line_items = req.body.cartitems.map((item)=>{
      return{
        price_data:{
          currency:"inr",
          product_data:{
            name:item.name,
            images: [item.imageSrc],
          },
          unit_amount:(item.price)*100
        },
        quantity:item.count
      }
    })
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      mode:"payment",
      line_items,
      customer:customer?.id,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/checkout-success`,
      cancel_url: `${YOUR_DOMAIN}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during checkout.' });
  }
};





