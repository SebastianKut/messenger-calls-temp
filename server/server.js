require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
  })
);

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = [
  {
    id: 1,
    priceInCents: 10000,
    name: 'Call logs download',
  },
];

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.find((object) => object.id === item.id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity
        };
      }),
      success_url: `${process.env.CLIENT_URL}/messenger-call-logs/client/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/messenger-call-logs/client/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
