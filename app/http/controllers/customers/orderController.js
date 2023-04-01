const Order = require('../../../models/order');
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orderController() {
    return {
        store(req, res) {
            const {phone, address, stripeToken, paymentType} = req.body;
            if(!phone || !address) {
                return res.status(422).json({message: 'All fields are required'});
            }

            const order = new Order({
                customerId: req.user._Id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                Order.populate(result, {path: 'customerId'}, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')

                    //Stripe payment

                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'ves',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {})
                        })
                    }
                })
            })
        }
    }
}