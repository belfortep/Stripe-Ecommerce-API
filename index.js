const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const stripeRoutes = require('./routes/stripe')
const cors = require('cors')


//------------------------------CONFIG------------------------------

dotenv.config()

app.set('port', process.env.PORT || 5000)

app.use(express.json())

app.use(cors())

//------------------------------CONNNECTION TO DB------------------------------

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected succesfully'))
    .catch((err) => console.log(err))

//------------------------------ROUTES------------------------------

app.use('/api/users', userRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/products', productRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/carts', cartRoutes)

app.use('/api/checkout', stripeRoutes)


//------------------------------OPENING SERVER...------------------------------

app.listen(app.get('port'), () => {
    console.log('server on port ' + app.get('port'))
})