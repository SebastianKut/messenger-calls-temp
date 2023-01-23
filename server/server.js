require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());

const cors = require('cors');
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  })
);
app.use(express.urlencoded({ extended: true }));

// const db = require('./models/index');
// db.sequelize.sync();

// require('./routes/articles.routes')(app);

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = [
  {
    id: 1,
    priceInCents: 10000,
    name: 'Call logs download',
  },
];

const tempSessionArray = [];

app.post('/create-checkout-session', async (req, res) => {
  console.log('Cookie', req.cookies);
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
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    // this sends url for stripe checkout to the client
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/order/success', async (req, res) => {
  const sessionId = await stripe.checkout.sessions.retrieve(
    req.query.session_id
  );
  const customer = await stripe.customers.retrieve(sessionId.customer);

  console.log('Sucess session details', sessionId.id);
  console.log('Cuustomer details', customer);
  // Create cookie
  res.cookie(`Messenger_call_logs_session`, sessionId.id, {
    maxAge: 1209600000, // 14 days in miliseconds
    secure: false, //CHANGE TO TRUE FOR PRODUCTION
    httpOnly: false, // Client js cant access it
    sameSite: 'lax',
  });

  // Write session details to database - for tests only to local variable
  tempSessionArray.push({
    session: sessionId.id,
    downloadsNumber: 0,
    valid: true,
  });

  // create sucess page
  res.redirect(`${process.env.CLIENT_URL}/success.html`);
});

app.post('/download/check', async (req, res) => {
  // Check if cookie exists
  // Fetch pierdolony nie wysyla cookie
  const sessionId = req.cookies;
  console.log('Cookie from client', sessionId);
  console.log('Temo session array', tempSessionArray);

  if(!sessionId.Messenger_call_logs_session) return  res.status(401).send('Fail');
  // If cookie exists check sessionId from cookie in db if still valid and if downloads < 3
  if (tempSessionArray.length) {
    const record = tempSessionArray.find(
      (element) => element.session === sessionId.Messenger_call_logs_session
    );

    if (record.valid && record.downloadsNumber < 3) {
      record.downloadsNumber += 1;
    return res.status(200).send('Success');
    }

    if (record.valid && record.downloadsNumber >= 3) {
      record.valid = false;
     return res.status(401).send('Fail');
    }
  }

  // if downloads >= 3 mark in db as session invalid and delete cookie
  
  // if valid send success and increment downloads number in db
  res.status(401).send('Fail');
});

app.listen(3000);
