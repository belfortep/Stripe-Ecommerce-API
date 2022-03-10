const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)


router.post('/payment', (req, res) => {
    //cuando hacemos un pago, stripe devuelve un tokenId que lo uso aca
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            return res.status(500).json(stripeErr)
        } else {
            res.status(200).json(stripeRes)
        }
    })

})

module.exports = router