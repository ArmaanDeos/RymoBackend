const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 9700;
let mongoUrl = process.env.MONGO_URL;
const cors = require('cors');


const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')

app.use(express.json());
app.use(cors());

// ENDPOINTS
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);













//DataBase Connection
let mongoose = require('mongoose');
mongoose.connect(mongoUrl)
.then(() => console.log("DataBase Connection Successful"))
.catch((err) => {
    console.log(err);
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server Running on port ${port}`);
})
